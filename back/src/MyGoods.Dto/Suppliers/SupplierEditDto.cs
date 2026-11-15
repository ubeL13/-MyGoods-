using System.ComponentModel.DataAnnotations;

namespace MyGoods.Dto.Suppliers;

/// <summary>
/// Данные для редактирования поставщика.
/// </summary>
public class SupplierEditDto
{
    /// <summary>
    /// Наименование поставщика.
    /// </summary>
    [Required(ErrorMessage = "Название обязательно.")]
    [MaxLength(200, ErrorMessage = "Название не длиннее 200 символов.")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// ИНН поставщика.
    /// </summary>
    [RegularExpression(@"^\d{10}(\d{2})?$", ErrorMessage = "ИНН должен содержать 10 или 12 цифр.")]
    public string? Inn { get; set; }

    /// <summary>
    /// Контактное лицо.
    /// </summary>
    [MaxLength(200, ErrorMessage = "Контактное лицо не длиннее 200 символов.")]
    public string? ContactPerson { get; set; }

    /// <summary>
    /// Телефон поставщика.
    /// </summary>
    [Required(ErrorMessage = "Телефон поставщика обязателен.")]
    [MaxLength(20, ErrorMessage = "Телефон не длиннее 20 символов.")]
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Электронная почта поставщика.
    /// </summary>
    [MaxLength(150, ErrorMessage = "Email не длиннее 150 символов.")]
    [EmailAddress(ErrorMessage = "Неверный формат email.")]
    public string? Email { get; set; }

    /// <summary>
    /// Адрес поставщика.
    /// </summary>
    [MaxLength(500, ErrorMessage = "Адрес не длиннее 500 символов.")]
    public string? Address { get; set; }
}