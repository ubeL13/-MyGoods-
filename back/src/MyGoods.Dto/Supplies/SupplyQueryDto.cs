using System.ComponentModel.DataAnnotations;

namespace MyGoods.Dto.Supplies;

/// <summary>
/// Параметры списка поставок (строка запроса GET /api/v1/supplies). Все параметры необязательные.
/// </summary>
public class SupplyQueryDto
{
    /// <summary>
    /// Статус: Created, Received, Cancelled.
    /// </summary>
    [AllowedValues(null, "Created", "Received", "Cancelled",
        ErrorMessage = "status: допустимо Created, Received, Cancelled.")]
    public string? Status { get; set; }

    /// <summary>
    /// Поставки одного поставщика.
    /// </summary>
    public Guid? SupplierId { get; set; }

    /// <summary>
    /// Поиск по номеру поставки или названию поставщика.
    /// </summary>
    [MaxLength(200, ErrorMessage = "Поисковый запрос не длиннее 200 символов.")]
    public string? Search { get; set; }

    /// <summary>
    /// Номер страницы, начиная с 1.
    /// </summary>
    [Range(1, int.MaxValue, ErrorMessage = "Номер страницы — от 1.")]
    public int Page { get; set; } = 1;

    /// <summary>
    /// Поставок на странице (1–100, по умолчанию 20).
    /// </summary>
    [Range(1, 100, ErrorMessage = "На странице от 1 до 100 поставок.")]
    public int Limit { get; set; } = 20;
}
