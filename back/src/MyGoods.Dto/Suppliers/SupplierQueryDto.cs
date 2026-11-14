using System.ComponentModel.DataAnnotations;

namespace MyGoods.Dto.Suppliers;

/// <summary>
/// Параметры поиска и пагинации поставщиков.
/// </summary>
public class SupplierQueryDto
{
    /// <summary>
    /// Поиск по названию, ИНН или телефону.
    /// </summary>
    [MaxLength(200, ErrorMessage = "Поисковый запрос не длиннее 200 символов.")]
    public string? Search { get; set; }

    /// <summary>
    /// Номер страницы, начиная с 1.
    /// </summary>
    [Range(1, int.MaxValue, ErrorMessage = "Номер страницы от 1.")]
    public int Page { get; set; } = 1;

    /// <summary>
    /// Поставщиков на странице (1–100, по умолчанию 20).
    /// </summary>
    [Range(1, 100, ErrorMessage = "На странице от 1 до 100 поставщиков.")]
    public int Limit { get; set; } = 20;
}
