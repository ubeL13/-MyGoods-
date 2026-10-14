using System.ComponentModel.DataAnnotations;

namespace MyGoods.Dto.Products;

/// <summary>
/// Данные формы товара — используются и при создании, и при редактировании.
/// </summary>
public class ProductEditDto
{
    /// <summary>
    /// Идентификатор категории.
    /// </summary>
    [Required(ErrorMessage = "Категория обязательна.")]
    public Guid? CategoryId { get; set; }

    /// <summary>
    /// Артикул (уникальный).
    /// </summary>
    [Required(ErrorMessage = "Артикул обязателен.")]
    [MaxLength(50, ErrorMessage = "Артикул не длиннее 50 символов.")]
    public string Sku { get; set; } = string.Empty;

    /// <summary>
    /// Название товара.
    /// </summary>
    [Required(ErrorMessage = "Название обязательно.")]
    [MaxLength(200, ErrorMessage = "Название не длиннее 200 символов.")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Цена в рублях (больше 0).
    /// </summary>
    [Range(0.01, 9999999999.99, ErrorMessage = "Цена должна быть больше 0.")]
    public decimal Price { get; set; }

    /// <summary>
    /// Описание товара.
    /// </summary>
    [MaxLength(1000, ErrorMessage = "Описание не длиннее 1000 символов.")]
    public string Description { get; set; } = string.Empty;

    /// <summary>
    /// Производитель.
    /// </summary>
    [MaxLength(100, ErrorMessage = "Производитель не длиннее 100 символов.")]
    public string Manufacturer { get; set; } = string.Empty;

    /// <summary>
    /// Минимальный остаток на складе.
    /// </summary>
    [Range(0, int.MaxValue, ErrorMessage = "Минимальный остаток не может быть отрицательным.")]
    public int Min { get; set; }
}
