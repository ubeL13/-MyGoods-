using Microsoft.EntityFrameworkCore;
using MyGoods.Core.Entities;
using MyGoods.Core.Repositories;
using MyGoods.Infrastructure.Data;

namespace MyGoods.Infrastructure.Repositories;

/// <summary>
/// Репозиторий заказов.
/// </summary>
/// <param name="dbContext">Контекст базы данных</param>
public class OrderRepository(AppDbContext dbContext) : Repository<Order>(dbContext), IOrderRepository
{
    /// <summary>
    /// Возвращает заказ вместе с покупателем, позициями и товарами позиций (с остатками).
    /// </summary>
    /// <param name="id">Идентификатор заказа</param>
    public override async Task<Order?> Read(Guid id) =>
        await Set
            .Include(o => o.Customer)
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p!.RemainingProduct)
            .FirstOrDefaultAsync(o => o.Id == id);
}
