using MyGoods.Core.Entities;
using MyGoods.Core.Repositories;

namespace MyGoods.Tests.Fakes;

/// <summary>
/// Заглушка репозитория покупателей: хранит покупателей в обычном списке.
/// </summary>
public class FakeCustomerRepository : ICustomerRepository
{
    /// <summary>
    /// «Таблица» покупателей.
    /// </summary>
    public List<Customer> Customers { get; } = [];

    /// <inheritdoc />
    public Task<Customer> Create(Customer entity)
    {
        if (entity.Id == Guid.Empty)
            entity.Id = Guid.NewGuid();

        Customers.Add(entity);
        return Task.FromResult(entity);
    }

    /// <inheritdoc />
    public Task<List<Customer>> Read() => Task.FromResult(Customers.ToList());

    /// <inheritdoc />
    public Task<Customer?> Read(Guid id) => Task.FromResult(Customers.FirstOrDefault(c => c.Id == id));

    /// <inheritdoc />
    public Task Update(Customer entity) => Task.CompletedTask;

    /// <inheritdoc />
    public Task<bool> Delete(Guid id) => Task.FromResult(Customers.RemoveAll(c => c.Id == id) > 0);

    /// <inheritdoc />
    public Task<bool> PhoneExists(string phone) => Task.FromResult(Customers.Any(c => c.Phone == phone));
}
