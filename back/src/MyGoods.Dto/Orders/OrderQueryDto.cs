using System.ComponentModel.DataAnnotations;

namespace MyGoods.Dto.Orders;

/// <summary>
/// Параметры списка заказов (строка запроса GET /api/v1/orders). Все параметры необязательные.
/// </summary>
public class OrderQueryDto
{
    /// <summary>
    /// Статус: New, Confirmed, Assembled, Shipped, Delivered, Cancelled.
    /// </summary>
    [AllowedValues(null, "New", "Confirmed", "Assembled", "Shipped", "Delivered", "Cancelled",
        ErrorMessage = "status: допустимо New, Confirmed, Assembled, Shipped, Delivered, Cancelled.")]
    public string? Status { get; set; }

    /// <summary>
    /// Поиск по номеру заказа, имени или телефону покупателя.
    /// </summary>
    [MaxLength(200, ErrorMessage = "Поисковый запрос не длиннее 200 символов.")]
    public string? Search { get; set; }

    /// <summary>
    /// Номер страницы, начиная с 1.
    /// </summary>
    [Range(1, int.MaxValue, ErrorMessage = "Номер страницы — от 1.")]
    public int Page { get; set; } = 1;

    /// <summary>
    /// Заказов на странице (1–100, по умолчанию 20).
    /// </summary>
    [Range(1, 100, ErrorMessage = "На странице от 1 до 100 заказов.")]
    public int Limit { get; set; } = 20;
}
