namespace MyGoods.Dto.Orders;

/// <summary>
/// Заказ в ответе API.
/// </summary>
/// <param name="Id">Идентификатор заказа</param>
/// <param name="CustomerId">Идентификатор покупателя</param>
/// <param name="CustomerName">Имя покупателя</param>
/// <param name="CustomerPhone">Телефон покупателя</param>
/// <param name="Status">Статус: New, Confirmed, Assembled, Shipped, Delivered, Cancelled</param>
/// <param name="DeliveryAddress">Адрес доставки</param>
/// <param name="TotalAmount">Сумма заказа</param>
/// <param name="CreatedAt">Дата создания (UTC)</param>
/// <param name="UpdatedAt">Дата изменения (UTC)</param>
/// <param name="Items">Позиции заказа</param>
public record OrderDto(
    Guid Id,
    Guid CustomerId,
    string? CustomerName,
    string? CustomerPhone,
    string Status,
    string DeliveryAddress,
    decimal TotalAmount,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    List<OrderItemDto> Items);

/// <summary>
/// Позиция заказа в ответе API.
/// </summary>
/// <param name="ProductId">Идентификатор товара</param>
/// <param name="Sku">Артикул</param>
/// <param name="ProductName">Название товара</param>
/// <param name="Quantity">Количество</param>
/// <param name="Price">Цена за единицу на момент заказа</param>
/// <param name="Sum">Сумма по позиции</param>
public record OrderItemDto(
    Guid ProductId,
    string? Sku,
    string? ProductName,
    int Quantity,
    decimal Price,
    decimal Sum);
