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
    /// Статус остатка. Не хранится в базе — всегда вычисляется из Quantity и Min,
    /// поэтому не может разойтись с количеством.
    /// </summary>
    public StockStatus Status =>
        Quantity <= 0 ? StockStatus.OutOfStock
        : Quantity <= Min ? StockStatus.LessMinimum
        : StockStatus.Available;
}
