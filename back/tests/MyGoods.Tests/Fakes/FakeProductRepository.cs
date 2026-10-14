using MyGoods.Core.Entities;
using MyGoods.Core.Repositories;

namespace MyGoods.Tests.Fakes;

/// <summary>
/// Заглушка репозитория товаров: хранит товары в обычном списке вместо базы данных.
/// Нужна, чтобы тестировать только логику сервиса, без PostgreSQL.
/// </summary>
public class FakeProductRepository : IProductRepository
{
    /// <summary>
    /// «Таблица» товаров.
    /// </summary>
    public List<Product> Products { get; } = [];

    /// <summary>
    /// Последний фильтр, с которым вызывали каталог (чтобы проверить, что передал сервис).
    /// </summary>
    public ProductFilter? LastFilter { get; private set; }

    /// <inheritdoc />
    public Task<Product> Create(Product entity)
    {
        if (entity.Id == Guid.Empty)
            entity.Id = Guid.NewGuid();

        Products.Add(entity);
        return Task.FromResult(entity);
    }

    /// <inheritdoc />
    public Task<List<Product>> Read() => Task.FromResult(Products.ToList());

    /// <inheritdoc />
    public Task<Product?> Read(Guid id) => Task.FromResult(Products.FirstOrDefault(p => p.Id == id));

    /// <inheritdoc />
    public Task Update(Product entity) => Task.CompletedTask;

    /// <inheritdoc />
    public Task<bool> Delete(Guid id) => Task.FromResult(Products.RemoveAll(p => p.Id == id) > 0);

    /// <inheritdoc />
    public Task<bool> SkuExists(string sku, Guid? excludeProductId = null) =>
        Task.FromResult(Products.Any(p => p.Sku == sku && p.Id != excludeProductId));

    /// <inheritdoc />
    public Task<(List<Product> Items, int Total)> GetCatalog(ProductFilter filter)
    {
        LastFilter = filter;
        return Task.FromResult((Products.ToList(), Products.Count));
    }
}
