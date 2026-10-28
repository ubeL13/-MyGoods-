using Microsoft.AspNetCore.Mvc;
using MyGoods.Dto.Orders;
using MyGoods.Dto.Services;

namespace MyGoods.Api.Controllers;

/// <summary>
/// Заказы покупателей.
/// </summary>
/// <param name="orderService">Сервис заказов</param>
[ApiController]
[Route("api/v1/orders")]
public class OrdersController(IOrderService orderService) : ControllerBase
{
    /// <summary>
    /// Создаёт заказ вручную (менеджер). Покупатель — существующий (customerId) или новый (newCustomer).
    /// Заказ создаётся в статусе «Новый», цены позиций фиксируются на момент создания.
    /// </summary>
    /// <param name="dto">Данные заказа</param>
    [HttpPost]
    [ProducesResponseType<OrderDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<OrderDto>> Create(OrderCreateDto dto)
    {
        var order = await orderService.Create(dto);
        return Created($"/api/v1/orders/{order.Id}", order);
    }
}
