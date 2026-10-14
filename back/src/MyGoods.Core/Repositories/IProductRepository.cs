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
    /// Выборка товаров для каталога. Фильтрация, сортировка и пагинация выполняются
    /// в базе данных одним SQL-запросом, а не в памяти.
    /// </summary>
    /// <param name="filter">Условия выборки, сортировка и страница</param>
    /// <returns>Товары одной страницы (с категорией и остатком) и общее количество подходящих товаров</returns>
    Task<(List<Product> Items, int Total)> GetCatalog(ProductFilter filter);
}
