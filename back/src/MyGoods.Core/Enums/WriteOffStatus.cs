namespace MyGoods.Core.Enums;

/// <summary>
/// Статус заявки на списание.
/// </summary>
public enum WriteOffStatus
{
    /// <summary>На рассмотрении.</summary>
    Pending = 1,

    /// <summary>Одобрена (товар списан).</summary>
    Approved = 2,

    /// <summary>Отклонена.</summary>
    Rejected = 3
}