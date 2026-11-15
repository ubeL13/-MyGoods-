using MyGoods.Core.Enums;

namespace MyGoods.Core.Entities;

/// <summary>Поставка товара от поставщика на склад.</summary>
public class Supply
{
    /// <summary>Идентификатор поставки.</summary>
    public Guid Id { get; set; }

    /// <summary>Человекочитаемый номер поставки (генерируется базой).</summary>
    public int Number { get; set; }

    /// <summary>Идентификатор поставщика.</summary>
    public Guid SupplierId { get; set; }

    /// <summary>Поставщик, у которого оформлена поставка.</summary>
    public Supplier? Supplier { get; set; }

    /// <summary>Статус поставки.</summary>
    public SupplyStatus Status { get; set; } = SupplyStatus.Created;

    /// <summary>Комментарий к поставке.</summary>
    public string? Comment { get; set; }

    /// <summary>Дата и время оформления поставки (UTC).</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Дата и время последнего изменения (UTC).</summary>
    public DateTime? UpdatedAt { get; set; }

    /// <summary>Дата и время приёмки товара на склад (UTC). Пусто, пока поставка не принята.</summary>
    public DateTime? ReceivedAt { get; set; }

    /// <summary>Сумма поставки: заказанное количество × закупочная цена.</summary>
    public decimal TotalAmount { get; private set; }

    /// <summary>Позиции поставки.</summary>
    public ICollection<SupplyItem> Items { get; set; } = new List<SupplyItem>();

    /// <summary>
    /// Пересчитывает сумму поставки по позициям.
    /// </summary>
    public void RecalculateTotal()
    {
        TotalAmount = Items.Sum(item => item.PurchasePrice * item.Quantity);
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Изменяет статус поставки. При приёмке запоминает её дату.
    /// </summary>
    public void ChangeStatus(SupplyStatus newStatus)
    {
        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;

        if (newStatus == SupplyStatus.Received)
            ReceivedAt = UpdatedAt;
    }
}
