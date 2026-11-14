using Microsoft.AspNetCore.Mvc;
using MyGoods.Dto;
using MyGoods.Dto.Services;
using MyGoods.Dto.Suppliers;

namespace MyGoods.Api.Controllers;

/// <summary>
/// Поставщики: список с поиском, карточка, создание, редактирование, архивация.
/// </summary>
/// <param name="supplierService">Сервис поставщиков</param>
[ApiController]
[Route("api/v1/suppliers")]
public class SuppliersController(ISupplierService supplierService) : ControllerBase
{
    /// <summary>
    /// Список поставщиков с поиском по названию, ИНН или телефону.
    /// </summary>
    /// <param name="query">Параметры списка из строки запроса</param>
    [HttpGet]
    [ProducesResponseType<PagedResult<SupplierDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PagedResult<SupplierDto>>> GetList([FromQuery] SupplierQueryDto query) =>
        Ok(await supplierService.GetList(query));

    /// <summary>
    /// Поставщик по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор поставщика</param>
    [HttpGet("{id:guid}")]
    [ProducesResponseType<SupplierDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SupplierDto>> GetById(Guid id) =>
        Ok(await supplierService.GetById(id));

    /// <summary>
    /// Создаёт поставщика. Название должно быть уникальным.
    /// </summary>
    /// <param name="dto">Данные поставщика</param>
    [HttpPost]
    [ProducesResponseType<SupplierDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<SupplierDto>> Create(SupplierCreateDto dto)
    {
        var supplier = await supplierService.Create(dto);
        return CreatedAtAction(nameof(GetById), new { id = supplier.Id }, supplier);
    }

    /// <summary>
    /// Изменяет данные поставщика.
    /// </summary>
    /// <param name="id">Идентификатор поставщика</param>
    /// <param name="dto">Новые данные поставщика</param>
    [HttpPut("{id:guid}")]
    [ProducesResponseType<SupplierDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<SupplierDto>> Update(Guid id, SupplierEditDto dto) =>
        Ok(await supplierService.Update(id, dto));

    /// <summary>
    /// Архивирует поставщика (IsActive = false). Удалить поставщика нельзя.
    /// </summary>
    /// <param name="id">Идентификатор поставщика</param>
    [HttpPatch("{id:guid}/archive")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Archive(Guid id)
    {
        await supplierService.Archive(id);
        return NoContent();
    }
}