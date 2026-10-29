using Microsoft.AspNetCore.Mvc;
using MyGoods.Dto;
using MyGoods.Dto.Customers;
using MyGoods.Dto.Services;

namespace MyGoods.Api.Controllers;

/// <summary>
/// Покупатели: список с поиском, карточка, создание.
/// </summary>
/// <param name="customerService">Сервис покупателей</param>
[ApiController]
[Route("api/v1/customers")]
public class CustomersController(ICustomerService customerService) : ControllerBase
{
    /// <summary>
    /// Список покупателей с поиском по имени или телефону (для выбора покупателя в форме заказа).
    /// </summary>
    /// <param name="query">Параметры списка из строки запроса</param>
    [HttpGet]
    [ProducesResponseType<PagedResult<CustomerDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PagedResult<CustomerDto>>> GetList([FromQuery] CustomerQueryDto query) =>
        Ok(await customerService.GetList(query));

    /// <summary>
    /// Покупатель по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор покупателя</param>
    [HttpGet("{id:guid}")]
    [ProducesResponseType<CustomerDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CustomerDto>> GetById(Guid id) =>
        Ok(await customerService.GetById(id));

    /// <summary>
    /// Создаёт покупателя. Телефон должен быть уникальным.
    /// </summary>
    /// <param name="dto">Данные покупателя</param>
    [HttpPost]
    [ProducesResponseType<CustomerDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<CustomerDto>> Create(CustomerCreateDto dto)
    {
        var customer = await customerService.Create(dto);
        return CreatedAtAction(nameof(GetById), new { id = customer.Id }, customer);
    }
}
