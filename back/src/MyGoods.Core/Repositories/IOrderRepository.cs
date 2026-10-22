using MyGoods.Core.Entities;

namespace MyGoods.Core.Repositories;

/// <summary>
/// Репозиторий заказов: базовый CRUD и загрузка заказа вместе с покупателем и позициями.
/// </summary>
public interface IOrderRepository : IRepository<Order>
{
}
