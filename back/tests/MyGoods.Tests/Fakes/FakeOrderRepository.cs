using MyGoods.Core.Entities;
using MyGoods.Core.Repositories;

namespace MyGoods.Tests.Fakes;

/// <summary>
/// Заглушка репозитория заказов: хранит заказы в списке и, как база, выдаёт номера 1, 2, 3…
/// </summary>
public class FakeOrderRepository : IOrderRepository
{
    /// <summary>
    /// «Таблица» заказов.
    /// </summary>
    public List<Order> Orders { get; } = [];

    /// <inheritdoc />
    public Task<Order> Create(Order entity)
    {
        if (entity.Id == Guid.Empty)
            entity.Id = Guid.NewGuid();

        entity.Number = Orders.Count + 1;
        Orders.Add(entity);
        return Task.FromResult(entity);
    }

    /// <inheritdoc />
    public Task<List<Order>> Read() => Task.FromResult(Orders.ToList());

    /// <inheritdoc />
    public Task<Order?> Read(Guid id) => Task.FromResult(Orders.FirstOrDefault(o => o.Id == id));

    /// <inheritdoc />
    public Task Update(Order entity) => Task.CompletedTask;

    /// <inheritdoc />
    public Task<bool> Delete(Guid id) => Task.FromResult(Orders.RemoveAll(o => o.Id == id) > 0);

    /// <summary>
    /// Как в базе: если всех товаров доступно достаточно — резервирует и сохраняет заказ,
    /// иначе ничего не меняет и возвращает товары, которых не хватило.
    /// </summary>
    public async Task<List<Guid>> CreateWithReservation(Order order)
    {
        var failed = order.Items
            .Where(i => (i.Product?.RemainingProduct?.Available ?? 0) < i.Quantity)
            .Select(i => i.ProductId)
            .ToList();

        if (failed.Count > 0)
            return failed;

        foreach (var item in order.Items)
            item.Product!.RemainingProduct!.Reserved += item.Quantity;

        await Create(order);
        return failed;
    }

    /// <summary>
    /// Как в базе: списывает товары со склада и снимает их резерв.
    /// </summary>
    public Task<List<Guid>> SaveShipped(Order order)
    {
        var failed = order.Items
            .Where(i => (i.Product?.RemainingProduct?.Reserved ?? 0) < i.Quantity)
            .Select(i => i.ProductId)
            .ToList();

        if (failed.Count > 0)
            return Task.FromResult(failed);

        foreach (var item in order.Items)
        {
            item.Product!.RemainingProduct!.Quantity -= item.Quantity;
            item.Product.RemainingProduct.Reserved -= item.Quantity;
        }

        return Task.FromResult(failed);
    }
}
