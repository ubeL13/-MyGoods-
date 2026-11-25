namespace MyGoods.Core.Enums;

/// <summary>
/// Причина списания товара.
/// </summary>
public enum WriteOffReason
{
    /// <summary>Порча товара.</summary>
    Damaged = 1,

    /// <summary>Утрата (потеря).</summary>
    Lost = 2,

    /// <summary>Истёк срок годности.</summary>
    Expired = 3,

    /// <summary>Другое (требуется комментарий).</summary>
    Other = 4
}