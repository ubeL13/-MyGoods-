using MyGoods.Core.Entities;
using MyGoods.Core.Enums;

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
    
    /// <summary>
    /// Список заказов с фильтром по статусу, поиском и пагинацией; новые сверху. Фильтрация выполняется в базе.
    /// </summary>
    /// <param name="status">Статус (необязательно)</param>
    /// <param name="search">Номер заказа, часть имени или цифры телефона покупателя (необязательно)</param>
    /// <param name="page">Номер страницы (с 1)</param>
    /// <param name="limit">Заказов на странице</param>
    /// <returns>Заказы страницы и общее количество найденных</returns>
    Task<(List<Order> Items, int Total)> Search(OrderStatus? status, string? search, int page, int limit);
}