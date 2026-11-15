namespace MyGoods.Dto.Supplies;

/// <summary>
/// Поставка в ответе API.
/// </summary>
/// <param name="Id">Идентификатор поставки</param>
/// <param name="Number">Номер поставки (выдаёт база)</param>
/// <param name="Status">Статус: Created, Received, Cancelled</param>
/// <param name="SupplierId">Идентификатор поставщика</param>
/// <param name="SupplierName">Название поставщика</param>
/// <param name="Comment">Комментарий</param>
/// <param name="TotalAmount">Сумма по заказанному количеству</param>
/// <param name="ReceivedAmount">Сумма по принятому количеству (пусто, пока не принята)</param>
/// <param name="CreatedAt">Дата оформления (UTC)</param>
/// <param name="ReceivedAt">Дата приёмки (UTC)</param>
/// <param name="Items">Позиции поставки</param>
public record SupplyDto(
    Guid Id,
    int Number,
    string Status,
    Guid SupplierId,
    string? SupplierName,
    string? Comment,
    decimal TotalAmount,
    decimal? ReceivedAmount,
    DateTime CreatedAt,
    DateTime? ReceivedAt,
    List<SupplyItemDto> Items);

/// <summary>
/// Позиция поставки в ответе API.
/// </summary>
/// <param name="ProductId">Идентификатор товара</param>
/// <param name="Sku">Артикул</param>
/// <param name="ProductName">Название товара</param>
/// <param name="Quantity">Заказанное количество</param>
/// <param name="PurchasePrice">Закупочная цена за единицу</param>
/// <param name="ReceivedQuantity">Принятое количество (пусто, пока не принята)</param>
public record SupplyItemDto(
    Guid ProductId,
    string? Sku,
    string? ProductName,
    int Quantity,
    decimal PurchasePrice,
    int? ReceivedQuantity);
