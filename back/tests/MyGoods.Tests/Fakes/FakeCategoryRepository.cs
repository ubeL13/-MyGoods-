using MyGoods.Core.Entities;
using MyGoods.Core.Repositories;

namespace MyGoods.Tests.Fakes;

/// <summary>
/// Заглушка репозитория категорий: хранит категории в обычном списке вместо базы данных.
/// </summary>
public class FakeCategoryRepository : IRepository<Category>
{
    /// <summary>
    /// «Таблица» категорий.
    /// </summary>
    public List<Category> Categories { get; } = [];

    /// <inheritdoc />
    public Task<Category> Create(Category entity)
    {
        Categories.Add(entity);
        return Task.FromResult(entity);
    }

    /// <inheritdoc />
    public Task<List<Category>> Read() => Task.FromResult(Categories.ToList());

    /// <inheritdoc />
    public Task<Category?> Read(Guid id) => Task.FromResult(Categories.FirstOrDefault(c => c.Id == id));

    /// <inheritdoc />
    public Task Update(Category entity) => Task.CompletedTask;

    /// <inheritdoc />
    public Task<bool> Delete(Guid id) => Task.FromResult(Categories.RemoveAll(c => c.Id == id) > 0);
}
