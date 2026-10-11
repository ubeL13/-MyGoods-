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
    /// Возвращает товар вместе с категорией, остатком и фотографиями.
    /// </summary>
    /// <param name="id">Идентификатор товара</param>
    public override async Task<Product?> Read(Guid id) =>
        await Set
            .Include(p => p.Category)
            .Include(p => p.RemainingProduct)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);

    /// <inheritdoc />
    public async Task<bool> SkuExists(string sku, Guid? excludeProductId = null) =>
        await Set.AnyAsync(p => p.Sku == sku && p.Id != excludeProductId);
}
