using MyGoods.Core.Entities;

namespace MyGoods.Core.Repositories;

/// <summary>
/// Репозиторий заказов: базовый CRUD и загрузка заказа вместе с покупателем и позициями.
/// </summary>
public interface IOrderRepository : IRepository<Order>
{
    /// <summary>
    /// В одной транзакции резервирует товары позиций и сохраняет заказ.
    /// Если какого-то товара доступно меньше, чем нужно, ничего не резервируется и заказ не сохраняется.
    /// </summary>
    /// <param name="order">Новый заказ с позициями</param>
    /// <returns>Идентификаторы товаров, которых не хватило (пусто — заказ сохранён)</returns>
    Task<List<Guid>> CreateWithReservation(Order order);

    /// <summary>
    /// В одной транзакции списывает товары позиций со склада (и снимает их резерв) и сохраняет заказ
    /// с новым статусом «Отправлен».
    /// </summary>
    /// <param name="order">Заказ со статусом «Отправлен»</param>
    /// <returns>Идентификаторы товаров, которые не удалось списать (пусто — всё сохранено)</returns>
    Task<List<Guid>> SaveShipped(Order order);
}
