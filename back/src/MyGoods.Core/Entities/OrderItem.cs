namespace MyGoods.Core.Entities;

/// <summary>Позиция заказа (элемент корзины/заказа).</summary>
public class OrderItem
{
    /// <summary>Идентификатор позиции заказа.</summary>
    public Guid Id { get; set; }

    /// <summary>Идентификатор заказа.</summary>
    public Guid OrderId { get; set; }

    /// <summary>Заказ, к которому относится позиция.</summary>
    public Order? Order { get; set; }

    /// <summary>Идентификатор товара.</summary>
    public Guid ProductId { get; set; }

    /// <summary>Товар.</summary>
    public Product? Product { get; set; }

    /// <summary>Количество товара в заказе.</summary>
    public int Quantity { get; set; }

    /// <summary>Цена за единицу товара на момент оформления заказа.</summary>
    public decimal PriceAtOrder { get; set; }
    
}