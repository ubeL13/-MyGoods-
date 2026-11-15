namespace MyGoods.Dto.Supplies;

/// <summary>
/// Строка списка поставок.
/// </summary>
/// <param name="Id">Идентификатор поставки</param>
/// <param name="Number">Номер поставки</param>
/// <param name="Status">Статус: Created, Received, Cancelled</param>
/// <param name="SupplierId">Идентификатор поставщика</param>
/// <param name="SupplierName">Название поставщика</param>
/// <param name="ExpectedDate">Ожидаемая дата поступления</param>
/// <param name="ItemsCount">Количество позиций</param>
/// <param name="TotalAmount">Сумма по заказанному количеству</param>
/// <param name="CreatedAt">Дата оформления (UTC)</param>
/// <param name="ReceivedAt">Дата приёмки (UTC)</param>
public record SupplyListItemDto(
    Guid Id,
    int Number,
    string Status,
    Guid SupplierId,
    string? SupplierName,
    DateOnly? ExpectedDate,
    int ItemsCount,
    decimal TotalAmount,
    DateTime CreatedAt,
    DateTime? ReceivedAt);
