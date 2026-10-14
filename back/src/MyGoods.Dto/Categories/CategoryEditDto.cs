using System.ComponentModel.DataAnnotations;

namespace MyGoods.Dto.Categories;

/// <summary>
/// Данные формы категории — используются и при создании, и при редактировании.
/// </summary>
public class CategoryEditDto
{
    /// <summary>
    /// Название категории (уникальное).
    /// </summary>
    [Required(ErrorMessage = "Название обязательно.")]
    [MaxLength(100, ErrorMessage = "Название не длиннее 100 символов.")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Описание категории.
    /// </summary>
    [MaxLength(500, ErrorMessage = "Описание не длиннее 500 символов.")]
    public string? Description { get; set; }

    /// <summary>
    /// Родительская категория. Не указана — категория верхнего уровня.
    /// </summary>
    public Guid? ParentId { get; set; }
}
