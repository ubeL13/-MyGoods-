namespace MyGoods.Core.Enums;

/// <summary>
/// Статус остатка товара на складе.
/// </summary>
public enum StockStatus
{
    /// <summary>
    /// В наличии: количество больше минимального остатка.
    /// </summary>
    Available = 1,

    /// <summary>
    /// Заканчивается: количество больше 0, но не больше минимального остатка.
    /// </summary>
    LessMinimum = 2,

    /// <summary>
    /// Нет в наличии: количество 0.
    /// </summary>
    OutOfStock = 3
}
