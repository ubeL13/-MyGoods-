using System.ComponentModel.DataAnnotations;

namespace MyGoods.Dto.Customers;

/// <summary>
/// Данные для создания покупателя.
/// </summary>
public class CustomerCreateDto
{
    /// <summary>
    /// Имя или наименование покупателя.
    /// </summary>
    [Required(ErrorMessage = "Имя покупателя обязательно.")]
    [MaxLength(200, ErrorMessage = "Имя не длиннее 200 символов.")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Телефон в любом формате (+7 999 123-45-67, 89991234567) — сохраняется как 79991234567.
    /// </summary>
    [Required(ErrorMessage = "Телефон обязателен.")]
    [MaxLength(20, ErrorMessage = "Телефон не длиннее 20 символов.")]
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Электронная почта.
    /// </summary>
    [MaxLength(150, ErrorMessage = "Email не длиннее 150 символов.")]
    [EmailAddress(ErrorMessage = "Неверный формат email.")]
    public string? Email { get; set; }

    /// <summary>
    /// Адрес.
    /// </summary>
    [MaxLength(500, ErrorMessage = "Адрес не длиннее 500 символов.")]
    public string? Address { get; set; }
}
