using MyGoods.Core.Enums;

namespace MyGoods.Core.Entities;

/// <summary>
/// Заявка на списание товара со склада.
/// </summary>
public class WriteOff
{
    /// <summary>Идентификатор заявки.</summary>
    public Guid Id { get; set; }

    /// <summary>Человекочитаемый номер заявки (генерируется базой).</summary>
    public int Number { get; set; }

    /// <summary>Идентификатор товара.</summary>
    public Guid ProductId { get; set; }

    /// <summary>Товар, который списывается.</summary>
    public Product? Product { get; set; }

    /// <summary>Количество для списания.</summary>
    public int Quantity { get; set; }

    /// <summary>Причина списания.</summary>
    public WriteOffReason Reason { get; set; }

    /// <summary>Комментарий к заявке (обязателен, если причина — "Другое").</summary>
    public string? Comment { get; set; }

    /// <summary>Статус заявки.</summary>
    public WriteOffStatus Status { get; set; } = WriteOffStatus.Pending;

    /// <summary>Имя сотрудника, создавшего заявку.</summary>
    public required string CreatedBy { get; set; }

    /// <summary>Дата и время создания заявки (UTC).</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Дата и время рассмотрения заявки (UTC).</summary>
    public DateTime? ReviewedAt { get; set; }

    /// <summary>Причина отклонения заявки (заполняется, если статус Rejected).</summary>
    public string? RejectionReason { get; set; }
}