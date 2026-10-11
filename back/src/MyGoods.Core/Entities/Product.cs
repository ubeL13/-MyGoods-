namespace MyGoods.Core.Entities;

/// <summary>
/// Товар каталога. Товар не удаляется — его снимают с продажи (IsActive = false).
/// </summary>
public class Product
{
    /// <summary>
    /// Идентификатор товара.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Идентификатор категории товара.
    /// </summary>
    public Guid CategoryId { get; set; }

    /// <summary>
    /// Категория товара.
    /// </summary>
    public Category? Category { get; set; }

    /// <summary>
    /// Артикул (уникальный).
    /// </summary>
    public required string Sku { get; set; }

    /// <summary>
    /// Название товара.
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Цена в рублях.
    /// </summary>
    public decimal Price { get; set; }

    /// <summary>
    /// Описание товара.
    /// </summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Производитель.
    /// </summary>
    public string Manufacturer { get; set; } = string.Empty;

    /// <summary>
    /// Товар в продаже. False — снят с продажи.
    /// </summary>
    public bool IsActive { get; set; } = true;

    /// <summary>
    /// Дата создания (UTC).
    /// </summary>
    public DateTime CreatedAt { get; set; }

    /// <summary>
    /// Дата последнего изменения (UTC).
    /// </summary>
    public DateTime UpdatedAt { get; set; }

    /// <summary>
    /// Фотографии товара.
    /// </summary>
    public List<ProductImage> Images { get; set; } = [];

    /// <summary>
    /// Остаток товара на складе.
    /// </summary>
    public RemainingProduct? RemainingProduct { get; set; }
}
