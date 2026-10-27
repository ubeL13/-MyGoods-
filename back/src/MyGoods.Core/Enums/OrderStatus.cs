namespace MyGoods.Core.Enums;

/// <summary>
/// Статус заказа.
/// </summary>
public enum OrderStatus
{
    /// <summary>
    /// Новый: создан менеджером, ожидает обработки.
    /// </summary>
    New = 1,

    /// <summary>
    /// Подтверждён: принят кладовщиком в работу.
    /// </summary>
    Confirmed = 2,

    /// <summary>
    /// Собран: комплектация завершена, готов к отправке.
    /// </summary>
    Assembled = 3,

    /// <summary>
    /// Отправлен: остатки списаны со склада.
    /// </summary>
    Shipped = 4,

    /// <summary>
    /// Доставлен: получен покупателем, заказ закрыт.
    /// </summary>
    Delivered = 5,

    /// <summary>
    /// Отменён: отменён менеджером до момента отправки.
    /// </summary>
    Cancelled = 6
}