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

    private int _quantity;

    /// <summary>Количество товара в заказе (должно быть больше 0).</summary>
    public int Quantity
    {
        get => _quantity;
        set
        {
            if (value <= 0)
            {
                throw new ArgumentException("Количество должно быть больше нуля.", nameof(value));
            }
            _quantity = value;
        }
    }

    /// <summary>Цена за единицу товара на момент оформления заказа.</summary>
    public decimal PriceAtOrder { get; set; }
    
}