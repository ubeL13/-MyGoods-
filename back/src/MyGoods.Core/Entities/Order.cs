using MyGoods.Core.Enums;

namespace MyGoods.Core.Entities;

/// <summary>Заказ клиента.</summary>
public class Order
{
    /// <summary>Идентификатор заказа.</summary>
    public Guid Id { get; set; }
    
    /// <summary>Человекочитаемый номер заказа (например, 1024).</summary>
    public int Number { get; set; }

    /// <summary>Идентификатор покупателя.</summary>
    public Guid CustomerId { get; set; }

    /// <summary>Покупатель, оформивший заказ.</summary>
    public Customer? Customer { get; set; }

    /// <summary>Статус заказа.</summary>
    public OrderStatus Status { get; set; } = OrderStatus.New;

    /// <summary>Дата и время создания заказа (UTC).</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Дата и время последнего изменения (UTC).</summary>
    public DateTime? UpdatedAt { get; set; }

    /// <summary>Адрес доставки.</summary>
    public required string DeliveryAddress { get; set; }

    /// <summary>Итоговая стоимость заказа.</summary>
    public decimal TotalAmount { get; private set; }

    /// <summary>Позиции (товары) в заказе.</summary>
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();

    /// <summary>
    /// Пересчитывает итоговую сумму заказа на основе позиций.
    /// </summary>
    public void RecalculateTotal()
    {
        TotalAmount = Items.Sum(item => item.PriceAtOrder * item.Quantity);
        UpdatedAt = DateTime.UtcNow;
    }

    /// <summary>
    /// Изменяет статус заказа и обновляет дату изменения.
    /// </summary>
    public void ChangeStatus(OrderStatus newStatus)
    {
        Status = newStatus;
        UpdatedAt = DateTime.UtcNow;
    }
}