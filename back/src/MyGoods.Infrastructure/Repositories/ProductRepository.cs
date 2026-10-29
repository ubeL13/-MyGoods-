using Microsoft.EntityFrameworkCore;
using MyGoods.Core.Entities;
using MyGoods.Core.Repositories;
using MyGoods.Infrastructure.Data;

namespace MyGoods.Infrastructure.Repositories;

/// <summary>
/// Репозиторий товаров.
/// </summary>
/// <param name="dbContext">Контекст базы данных</param>
public class ProductRepository(AppDbContext dbContext) : Repository<Product>(dbContext), IProductRepository
{
    /// <summary>
    /// Возвращает товар вместе с категорией и остатком.
    /// </summary>
    /// <param name="id">Идентификатор товара</param>
    public override async Task<Product?> Read(Guid id) =>
        await Set
            .Include(p => p.Category)
            .Include(p => p.RemainingProduct)
            .FirstOrDefaultAsync(p => p.Id == id);

    /// <inheritdoc />
    public async Task<bool> SkuExists(string sku, Guid? excludeProductId = null) =>
        await Set.AnyAsync(p => p.Sku == sku && p.Id != excludeProductId);

    /// <inheritdoc />
    public async Task<(List<Product> Items, int Total)> GetCatalog(ProductFilter filter)
    {
        var query = ApplyFilter(Set.AsQueryable(), filter);

        // Сколько всего товаров подходит — нужно фронту для пагинации
        var total = await query.CountAsync();

        var items = await ApplySort(query, filter)
            .Skip((filter.Page - 1) * filter.Limit)
            .Take(filter.Limit)
            .Include(p => p.Category)
            .Include(p => p.RemainingProduct)
            .AsNoTracking()
            .ToListAsync();

        return (items, total);
    }

    /// <summary>
    /// Добавляет к запросу сортировку (SQL ORDER BY). Вторым ключом всегда идёт Id,
    /// чтобы порядок был стабильным и товары не «прыгали» между страницами.
    /// </summary>
    /// <param name="query">Запрос с фильтрами</param>
    /// <param name="filter">Поле и направление сортировки</param>
    private static IQueryable<Product> ApplySort(IQueryable<Product> query, ProductFilter filter)
    {
        var sorted = filter.SortBy switch
        {
            "price" => filter.Descending ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price),
            "stock" => filter.Descending
                ? query.OrderByDescending(p => p.RemainingProduct!.Quantity)
                : query.OrderBy(p => p.RemainingProduct!.Quantity),
            "createdAt" => filter.Descending ? query.OrderByDescending(p => p.CreatedAt) : query.OrderBy(p => p.CreatedAt),
            _ => filter.Descending ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name)
        };

        return sorted.ThenBy(p => p.Id);
    }

    /// <summary>
    /// Добавляет к запросу условия фильтра. Пока запрос не выполнен (IQueryable),
    /// каждое условие превращается в часть SQL WHERE.
    /// </summary>
    /// <param name="query">Исходный запрос</param>
    /// <param name="filter">Условия выборки</param>
    private static IQueryable<Product> ApplyFilter(IQueryable<Product> query, ProductFilter filter)
    {
        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var pattern = $"%{filter.Search.Trim()}%";
            query = query.Where(p => EF.Functions.ILike(p.Name, pattern) || EF.Functions.ILike(p.Sku, pattern));
        }

        if (filter.CategoryIds is { Count: > 0 })
            query = query.Where(p => filter.CategoryIds.Contains(p.CategoryId));

        if (filter.MinPrice.HasValue)
            query = query.Where(p => p.Price >= filter.MinPrice.Value);

        if (filter.MaxPrice.HasValue)
            query = query.Where(p => p.Price <= filter.MaxPrice.Value);

        if (filter.InStockOnly)
            // «В наличии» — то, что можно заказать: на складе минус зарезервировано
            query = query.Where(p => p.RemainingProduct != null && p.RemainingProduct.Quantity - p.RemainingProduct.Reserved > 0);

        if (filter.IsActive.HasValue)
            query = query.Where(p => p.IsActive == filter.IsActive.Value);
        
        if (filter.BelowMinOnly)
        {
            query = query.Where(p =>
                p.RemainingProduct != null &&
                p.RemainingProduct.Quantity - p.RemainingProduct.Reserved <= p.RemainingProduct.Min);
        }

        return query;
    }
}
