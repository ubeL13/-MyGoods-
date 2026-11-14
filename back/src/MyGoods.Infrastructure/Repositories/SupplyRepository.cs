using Microsoft.EntityFrameworkCore;
using MyGoods.Core.Entities;
using MyGoods.Core.Enums;
using MyGoods.Core.Repositories;
using MyGoods.Infrastructure.Data;

namespace MyGoods.Infrastructure.Repositories;

/// <summary>
/// Репозиторий поставок.
/// </summary>
/// <param name="dbContext">Контекст базы данных</param>
public class SupplyRepository(AppDbContext dbContext) : Repository<Supply>(dbContext), ISupplyRepository
{
    /// <summary>
    /// Возвращает поставку вместе с поставщиком, позициями и товарами позиций.
    /// </summary>
    /// <param name="id">Идентификатор поставки</param>
    public override async Task<Supply?> Read(Guid id) =>
        await Set
            .Include(s => s.Supplier)
            .Include(s => s.Items)
                .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(s => s.Id == id);

    /// <inheritdoc />
    public async Task<bool> SaveReceived(Supply supply)
    {
        await using var transaction = await DbContext.Database.BeginTransactionAsync();

        // Сначала «занимаем» поставку: UPDATE сработает, только если она всё ещё «Оформлена».
        // Строка поставки блокируется до конца транзакции, поэтому при двойном нажатии «Принять»
        // второй запрос дождётся первого, увидит статус «Принята» и ничего не изменит —
        // товар не добавится на склад дважды.
        if (!await TryLeaveCreated(supply.Id, SupplyStatus.Received))
        {
            await transaction.RollbackAsync();
            return false;
        }

        foreach (var item in supply.Items.Where(i => i.ReceivedQuantity > 0))
        {
            var received = item.ReceivedQuantity!.Value;

            // Увеличиваем остаток прямо в базе (Quantity = Quantity + принято), а не «прочитал — прибавил — записал»:
            // так параллельные заказы и поставки этого товара не затрут изменения друг друга
            var updated = await DbContext.RemainingProducts
                .Where(r => r.ProductId == item.ProductId)
                .ExecuteUpdateAsync(s => s.SetProperty(r => r.Quantity, r => r.Quantity + received));

            // У товара ещё нет записи об остатке — создаём её с принятым количеством
            if (updated == 0)
                await DbContext.RemainingProducts.AddAsync(
                    new RemainingProduct { ProductId = item.ProductId, Quantity = received });
        }

        // Сохраняем статус, дату приёмки и принятое количество по позициям
        await DbContext.SaveChangesAsync();
        await transaction.CommitAsync();
        return true;
    }

    /// <inheritdoc />
    public async Task<bool> SaveCancelled(Supply supply)
    {
        await using var transaction = await DbContext.Database.BeginTransactionAsync();

        if (!await TryLeaveCreated(supply.Id, SupplyStatus.Cancelled))
        {
            await transaction.RollbackAsync();
            return false;
        }

        await DbContext.SaveChangesAsync();
        await transaction.CommitAsync();
        return true;
    }

    /// <summary>
    /// Переводит поставку из «Оформлена» в новый статус одним условным UPDATE.
    /// </summary>
    /// <param name="supplyId">Идентификатор поставки</param>
    /// <param name="newStatus">Новый статус</param>
    /// <returns>True — статус изменён; false — поставка уже не в статусе «Оформлена»</returns>
    private async Task<bool> TryLeaveCreated(Guid supplyId, SupplyStatus newStatus) =>
        await DbContext.Supplies
            .Where(s => s.Id == supplyId && s.Status == SupplyStatus.Created)
            .ExecuteUpdateAsync(s => s.SetProperty(x => x.Status, newStatus)) == 1;
}
