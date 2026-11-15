using MyGoods.Core.Entities;
using MyGoods.Core.Repositories;

namespace MyGoods.Tests.Fakes;

/// <summary>
/// Заглушка репозитория поставщиков: хранит поставщиков в обычном списке вместо базы данных.
/// </summary>
public class FakeSupplierRepository : IRepository<Supplier>
{
    /// <summary>
    /// «Таблица» поставщиков.
    /// </summary>
    public List<Supplier> Suppliers { get; } = [];

    /// <inheritdoc />
    public Task<Supplier> Create(Supplier entity)
    {
        Suppliers.Add(entity);
        return Task.FromResult(entity);
    }

    /// <inheritdoc />
    public Task<List<Supplier>> Read() => Task.FromResult(Suppliers.ToList());

    /// <inheritdoc />
    public Task<Supplier?> Read(Guid id) => Task.FromResult(Suppliers.FirstOrDefault(s => s.Id == id));

    /// <inheritdoc />
    public Task Update(Supplier entity) => Task.CompletedTask;

    /// <inheritdoc />
    public Task<bool> Delete(Guid id) => Task.FromResult(Suppliers.RemoveAll(s => s.Id == id) > 0);
}
