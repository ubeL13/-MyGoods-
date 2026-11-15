using MyGoods.Core.Entities;
using MyGoods.Core.Enums;
using MyGoods.Core.Repositories;

namespace MyGoods.Tests.Fakes;

/// <summary>
/// Заглушка репозитория поставок: хранит поставки в списке и, как база, выдаёт номера 1, 2, 3…
/// </summary>
public class FakeSupplyRepository : ISupplyRepository
{
    /// <summary>
    /// «Таблица» поставок.
    /// </summary>
    public List<Supply> Supplies { get; } = [];

    /// <summary>
    /// Имитирует параллельный запрос: в базе поставку уже приняли или отменили,
    /// поэтому условный UPDATE «только если Оформлена» ничего не изменит.
    /// </summary>
    public bool AlreadyProcessedInDb { get; set; }

    /// <inheritdoc />
    public Task<Supply> Create(Supply entity)
    {
        if (entity.Id == Guid.Empty)
            entity.Id = Guid.NewGuid();

        entity.Number = Supplies.Count + 1;
        Supplies.Add(entity);
        return Task.FromResult(entity);
    }

    /// <inheritdoc />
    public Task<List<Supply>> Read() => Task.FromResult(Supplies.ToList());

    /// <inheritdoc />
    public Task<Supply?> Read(Guid id) => Task.FromResult(Supplies.FirstOrDefault(s => s.Id == id));

    /// <inheritdoc />
    public Task Update(Supply entity) => Task.CompletedTask;

    /// <inheritdoc />
    public Task<bool> Delete(Guid id) => Task.FromResult(Supplies.RemoveAll(s => s.Id == id) > 0);

    /// <summary>
    /// Как в базе: фильтр по статусу и поставщику; поиск здесь не нужен — он проверяется в SQL.
    /// </summary>
    public Task<(List<Supply> Items, int Total)> Search(
        SupplyStatus? status, Guid? supplierId, string? search, int page, int limit)
    {
        var found = Supplies
            .Where(s => status == null || s.Status == status)
            .Where(s => supplierId == null || s.SupplierId == supplierId)
            .ToList();

        return Task.FromResult((found.Skip((page - 1) * limit).Take(limit).ToList(), found.Count));
    }

    /// <summary>
    /// Как в базе: увеличивает остатки на принятое количество; если у товара нет записи остатка — создаёт её.
    /// </summary>
    public Task<bool> SaveReceived(Supply supply)
    {
        if (AlreadyProcessedInDb)
            return Task.FromResult(false);

        foreach (var item in supply.Items.Where(i => i.ReceivedQuantity > 0))
        {
            var product = item.Product!;
            product.RemainingProduct ??= new RemainingProduct { ProductId = product.Id };
            product.RemainingProduct.Quantity += item.ReceivedQuantity!.Value;
        }

        return Task.FromResult(true);
    }

    /// <inheritdoc />
    public Task<bool> SaveCancelled(Supply supply) => Task.FromResult(!AlreadyProcessedInDb);
}
