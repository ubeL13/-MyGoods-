using MyGoods.Core.Entities;

namespace MyGoods.Core.Repositories;

/// <summary>
/// Репозиторий товаров: базовый CRUD и операции, нужные только товарам.
/// </summary>
public interface IProductRepository : IRepository<Product>
{
    /// <summary>
    /// Проверяет, занят ли артикул другим товаром.
    /// </summary>
    /// <param name="sku">Артикул</param>
    /// <param name="excludeProductId">Товар, который не учитывать (при редактировании — сам товар)</param>
    /// <returns>True — артикул уже занят</returns>
    Task<bool> SkuExists(string sku, Guid? excludeProductId = null);

    /// <summary>
    /// Выборка товаров для каталога. Фильтрация выполняется в базе данных (SQL WHERE),
    /// а не в памяти.
    /// </summary>
    /// <param name="filter">Условия выборки</param>
    /// <returns>Товары с категорией и остатком</returns>
    Task<List<Product>> GetCatalog(ProductFilter filter);
}
