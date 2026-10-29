namespace MyGoods.Dto.Orders;

/// <summary>
/// Строка списка заказов.
/// </summary>
/// <param name="Id">Идентификатор заказа</param>
/// <param name="Number">Номер заказа</param>
/// <param name="CustomerName">Имя покупателя</param>
/// <param name="CustomerPhone">Телефон покупателя</param>
/// <param name="Status">Статус: New, Confirmed, Assembled, Shipped, Delivered, Cancelled</param>
/// <param name="TotalAmount">Сумма заказа</param>
/// <param name="ItemsCount">Количество позиций</param>
/// <param name="CreatedAt">Дата создания (UTC)</param>
public record OrderListItemDto(
    Guid Id,
    int Number,
    string? CustomerName,
    string? CustomerPhone,
    string Status,
    decimal TotalAmount,
    int ItemsCount,
    DateTime CreatedAt);
