namespace MyGoods.Core.Entities;

/// <summary>Позиция поставки: какой товар, сколько и по какой цене.</summary>
public class SupplyItem
{
    /// <summary>Идентификатор позиции.</summary>
    public Guid Id { get; set; }

    /// <summary>Идентификатор поставки.</summary>
    public Guid SupplyId { get; set; }

    /// <summary>Поставка, к которой относится позиция.</summary>
    public Supply? Supply { get; set; }

    /// <summary>Идентификатор товара.</summary>
    public Guid ProductId { get; set; }

    /// <summary>Товар.</summary>
    public Product? Product { get; set; }

    /// <summary>Заказанное у поставщика количество.</summary>
    public int Quantity { get; set; }

    /// <summary>Закупочная цена за единицу.</summary>
    public decimal PurchasePrice { get; set; }

    /// <summary>Фактически принятое количество. Пусто, пока поставка не принята.</summary>
    public int? ReceivedQuantity { get; set; }
}
