using Microsoft.AspNetCore.Mvc;
using MyGoods.Dto;
using MyGoods.Dto.Services;
using MyGoods.Dto.Supplies;

namespace MyGoods.Api.Controllers;

/// <summary>
/// Поставки товара от поставщиков на склад.
/// </summary>
/// <param name="supplyService">Сервис поставок</param>
[ApiController]
[Route("api/v1/supplies")]
public class SuppliesController(ISupplyService supplyService) : ControllerBase
{
    /// <summary>
    /// Список поставок: фильтр по статусу и поставщику, поиск по номеру или названию поставщика, пагинация. Новые сверху.
    /// </summary>
    /// <param name="query">Параметры списка из строки запроса</param>
    [HttpGet]
    [ProducesResponseType<PagedResult<SupplyListItemDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PagedResult<SupplyListItemDto>>> GetList([FromQuery] SupplyQueryDto query) =>
        Ok(await supplyService.GetList(query));

    /// <summary>
    /// Карточка поставки: поставщик, позиции, заказанное и принятое количество, суммы.
    /// </summary>
    /// <param name="id">Идентификатор поставки</param>
    [HttpGet("{id:guid}")]
    [ProducesResponseType<SupplyDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SupplyDto>> GetById(Guid id) =>
        Ok(await supplyService.GetById(id));

    /// <summary>
    /// Оформляет поставку у активного поставщика в статусе «Оформлена». Остатки не меняются до приёмки.
    /// </summary>
    /// <param name="dto">Поставщик, ожидаемая дата, комментарий и позиции</param>
    [HttpPost]
    [ProducesResponseType<SupplyDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SupplyDto>> Create(SupplyCreateDto dto)
    {
        var supply = await supplyService.Create(dto);
        return Created($"/api/v1/supplies/{supply.Id}", supply);
    }

    /// <summary>
    /// Принимает поставку на склад: по каждой позиции указывается фактически принятое количество
    /// (от 0 до заказанного), остатки товаров увеличиваются. Уже принятая или отменённая — 409.
    /// </summary>
    /// <param name="id">Идентификатор поставки</param>
    /// <param name="dto">Принятое количество по всем позициям</param>
    [HttpPost("{id:guid}/receive")]
    [ProducesResponseType<SupplyDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<SupplyDto>> Receive(Guid id, SupplyReceiveDto dto) =>
        Ok(await supplyService.Receive(id, dto));

    /// <summary>
    /// Отменяет оформленную поставку. Остатки не меняются. Уже принятая или отменённая — 409.
    /// </summary>
    /// <param name="id">Идентификатор поставки</param>
    [HttpPost("{id:guid}/cancel")]
    [ProducesResponseType<SupplyDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<SupplyDto>> Cancel(Guid id) =>
        Ok(await supplyService.Cancel(id));
}
