using Microsoft.AspNetCore.Mvc;
using MyGoods.Dto;
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
    /// Список заказов: фильтр по статусу, поиск по номеру, имени или телефону покупателя, пагинация. Новые сверху.
    /// </summary>
    /// <param name="query">Параметры списка из строки запроса</param>
    [HttpGet]
    [ProducesResponseType<PagedResult<OrderListItemDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PagedResult<OrderListItemDto>>> GetList([FromQuery] OrderQueryDto query) =>
        Ok(await orderService.GetList(query));

    /// <summary>
    /// Карточка заказа: покупатель, адрес, позиции, сумма, статус.
    /// </summary>
    /// <param name="id">Идентификатор заказа</param>
    [HttpGet("{id:guid}")]
    [ProducesResponseType<OrderDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OrderDto>> GetById(Guid id) =>
        Ok(await orderService.GetById(id));

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

    /// <summary>
    /// Меняет статус заказа (кладовщик): «Новый» → «Подтверждён» → «Собран» → «Отправлен».
    /// Недопустимый переход (например, сразу из «Нового» в «Отправлен») — 409.
    /// </summary>
    /// <param name="id">Идентификатор заказа</param>
    /// <param name="dto">Новый статус, например {"status": "Confirmed"}</param>
    [HttpPatch("{id:guid}/status")]
    [ProducesResponseType<OrderDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<OrderDto>> ChangeStatus(Guid id, OrderStatusChangeDto dto) =>
        Ok(await orderService.ChangeStatus(id, dto));
    
    /// <summary>
    /// Отменяет заказ. Возвращает 409, если заказ уже отправлен или доставлен.
    /// </summary>
    /// <param name="id">Идентификатор заказа</param>
    [HttpPost("{id:guid}/cancel")]
    public async Task<ActionResult<OrderDto>> Cancel(Guid id) => Ok(await orderService.Cancel(id));

    /// <summary>
    /// Отмечает заказ как доставленный. Доступно только для отправленных заказов.
    /// </summary>
    /// <param name="id">Идентификатор заказа</param>
    [HttpPost("{id:guid}/deliver")]
    public async Task<ActionResult<OrderDto>> Deliver(Guid id) => Ok(await orderService.Deliver(id));
}
