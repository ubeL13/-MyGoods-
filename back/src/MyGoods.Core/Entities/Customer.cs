namespace MyGoods.Core.Entities;

/// <summary>Покупатель (клиент).</summary>
public class Customer
{
    /// <summary>Идентификатор.</summary>
    public Guid Id { get; set; }

    /// <summary>Имя или наименование клиента.</summary>
    public required string Name { get; set; }

    /// <summary>Номер телефона.</summary>
    public required string Phone { get; set; }

    /// <summary>Адрес электронной почты.</summary>
    public string? Email { get; set; }

    /// <summary>Основной адрес доставки/проживания.</summary>
    public string? Address { get; set; }

    /// <summary>Дата и время создания (UTC).</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Дата и время последнего изменения (UTC).</summary>
    public DateTime? UpdatedAt { get; set; }

    /// <summary>Коллекция заказов клиента.</summary>
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}