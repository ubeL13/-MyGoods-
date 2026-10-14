using System.ComponentModel.DataAnnotations;

namespace MyGoods.Dto.Products;

/// <summary>
/// Снятие товара с продажи или возврат в продажу.
/// </summary>
public class ProductActiveDto
{
    /// <summary>
    /// True — вернуть в продажу, false — снять с продажи.
    /// </summary>
    [Required(ErrorMessage = "Поле isActive обязательно.")]
    public bool? IsActive { get; set; }
}
