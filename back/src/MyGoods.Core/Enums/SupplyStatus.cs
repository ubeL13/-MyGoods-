namespace MyGoods.Core.Enums;

/// <summary>
/// Статус поставки товара от поставщика.
/// </summary>
public enum SupplyStatus
{
    /// <summary>
    /// Оформлена: заказана у поставщика, товар ещё не пришёл на склад.
    /// </summary>
    Created = 1,

    /// <summary>
    /// Принята: товар пришёл, фактическое количество добавлено в остатки.
    /// </summary>
    Received = 2,

    /// <summary>
    /// Отменена до приёмки, остатки не менялись.
    /// </summary>
    Cancelled = 3
}
