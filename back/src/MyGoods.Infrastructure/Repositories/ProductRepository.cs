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
    public async Task<List<Product>> GetCatalog(ProductFilter filter) =>
        await ApplyFilter(Set.AsQueryable(), filter)
            .Include(p => p.Category)
            .Include(p => p.RemainingProduct)
            .AsNoTracking()
            .ToListAsync();

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
            query = query.Where(p => p.RemainingProduct != null && p.RemainingProduct.Quantity > 0);

        if (filter.IsActive.HasValue)
            query = query.Where(p => p.IsActive == filter.IsActive.Value);

        return query;
    }
}
