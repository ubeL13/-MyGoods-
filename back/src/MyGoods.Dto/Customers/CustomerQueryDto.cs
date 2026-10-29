using System.ComponentModel.DataAnnotations;

namespace MyGoods.Dto.Customers;

/// <summary>
/// Параметры списка покупателей (строка запроса GET /api/v1/customers).
/// </summary>
public class CustomerQueryDto
{
    /// <summary>
    /// Поиск по части имени или цифрам телефона.
    /// </summary>
    [MaxLength(200, ErrorMessage = "Поисковый запрос не длиннее 200 символов.")]
    public string? Search { get; set; }

    /// <summary>
    /// Номер страницы, начиная с 1.
    /// </summary>
    [Range(1, int.MaxValue, ErrorMessage = "Номер страницы — от 1.")]
    public int Page { get; set; } = 1;

    /// <summary>
    /// Покупателей на странице (1–100, по умолчанию 20).
    /// </summary>
    [Range(1, 100, ErrorMessage = "На странице от 1 до 100 покупателей.")]
    public int Limit { get; set; } = 20;
}
