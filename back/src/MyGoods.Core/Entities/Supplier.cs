using MyGoods.Core.Entities;

namespace MyGoods.Core.Entities;

/// <summary>
/// Поставщик товаров.
/// </summary>
public class Supplier
{
    /// <summary>Идентификатор.</summary>
    public Guid Id { get; set; }

    /// <summary>Название организации (уникальное).</summary>
    public required string Name { get; set; }

    /// <summary>ИНН (10 или 12 цифр).</summary>
    public string? Inn { get; set; }

    /// <summary>Контактное лицо.</summary>
    public string? ContactPerson { get; set; }

    /// <summary>Номер телефона (хранится только цифрами).</summary>
    public required string Phone { get; set; }

    /// <summary>Адрес электронной почты.</summary>
    public string? Email { get; set; }

    /// <summary>Юридический или фактический адрес.</summary>
    public string? Address { get; set; }

    /// <summary>Активен ли поставщик (архив вместо удаления).</summary>
    public bool IsActive { get; set; } = true;

    /// <summary>Дата и время создания (UTC).</summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>Дата и время последнего изменения (UTC).</summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // TODO 10.01
    // public ICollection<Supply> Supplies { get; set; } = new List<Supply>();
}