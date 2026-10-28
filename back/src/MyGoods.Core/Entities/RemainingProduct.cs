using MyGoods.Core.Enums;

namespace MyGoods.Core.Entities;

/// <summary>
/// Остаток товара на складе. У каждого товара ровно один остаток.
/// </summary>
public class RemainingProduct
{
    /// <summary>
    /// Идентификатор остатка.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Идентификатор товара.
    /// </summary>
    public Guid ProductId { get; set; }

    /// <summary>
    /// Товар.
    /// </summary>
    public Product? Product { get; set; }

    /// <summary>
    /// Текущее количество на складе.
    /// </summary>
    public int Quantity { get; set; }

    /// <summary>
    /// Минимальный остаток: если количество не больше него, товар «заканчивается».
    /// </summary>
    public int Min { get; set; }

    /// <summary>
    /// Зарезервировано в заказах, которые ещё не отправлены. Физически товар на складе,
    /// но продать его в другой заказ уже нельзя.
    /// </summary>
    public int Reserved { get; set; }

    /// <summary>
    /// Доступно к заказу: на складе минус зарезервировано. Не хранится в базе — вычисляется.
    /// </summary>
    public int Available => Quantity - Reserved;

    /// <summary>
    /// Статус остатка по доступному к заказу количеству. Не хранится в базе — всегда вычисляется,
    /// поэтому не может разойтись с количеством.
    /// </summary>
    public StockStatus Status =>
        Available <= 0 ? StockStatus.OutOfStock
        : Available <= Min ? StockStatus.LessMinimum
        : StockStatus.Available;
}
