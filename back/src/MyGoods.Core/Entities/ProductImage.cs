namespace MyGoods.Core.Entities;

/// <summary>
/// Фотография товара.
/// </summary>
public class ProductImage
{
    /// <summary>
    /// Идентификатор фотографии.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Идентификатор товара.
    /// </summary>
    public Guid ProductId { get; set; }

    /// <summary>
    /// Товар, к которому относится фотография.
    /// </summary>
    public Product? Product { get; set; }

    /// <summary>
    /// Адрес файла фотографии.
    /// </summary>
    public required string Url { get; set; }

    /// <summary>
    /// Главная фотография товара (показывается в каталоге).
    /// </summary>
    public bool IsMain { get; set; }
}
