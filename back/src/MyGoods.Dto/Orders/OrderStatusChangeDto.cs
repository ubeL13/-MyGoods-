using System.ComponentModel.DataAnnotations;

namespace MyGoods.Dto.Orders;

/// <summary>
/// Смена статуса заказа.
/// </summary>
public class OrderStatusChangeDto
{
    /// <summary>
    /// Новый статус: Confirmed (подтверждён), Assembled (собран), Shipped (отправлен) и т.д.
    /// </summary>
    [Required(ErrorMessage = "Укажите новый статус.")]
    [AllowedValues("New", "Confirmed", "Assembled", "Shipped", "Delivered", "Cancelled",
        ErrorMessage = "status: допустимо New, Confirmed, Assembled, Shipped, Delivered, Cancelled.")]
    public string? Status { get; set; }
}
