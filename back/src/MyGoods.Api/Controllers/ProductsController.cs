using Microsoft.AspNetCore.Mvc;
using MyGoods.Dto;
using MyGoods.Dto.Products;
using MyGoods.Dto.Services;

namespace MyGoods.Api.Controllers;

/// <summary>
/// Товары: каталог, карточка, создание, редактирование, снятие с продажи.
/// </summary>
/// <param name="productService">Сервис товаров</param>
[ApiController]
[Route("api/v1/products")]
public class ProductsController(IProductService productService) : ControllerBase
{
    /// <summary>
    /// Каталог товаров с поиском, фильтрами, сортировкой и пагинацией.
    /// </summary>
    /// <param name="query">Параметры каталога из строки запроса</param>
    [HttpGet]
    [ProducesResponseType<PagedResult<ProductDto>>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PagedResult<ProductDto>>> GetCatalog([FromQuery] ProductQueryDto query) =>
        Ok(await productService.GetCatalog(query));

    /// <summary>
    /// Возвращает товар по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор товара</param>
    [HttpGet("{id:guid}")]
    [ProducesResponseType<ProductDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDto>> GetById(Guid id) =>
        Ok(await productService.GetById(id));

    /// <summary>
    /// Создаёт товар. Остаток нового товара — 0.
    /// </summary>
    /// <param name="dto">Данные формы товара</param>
    [HttpPost]
    [ProducesResponseType<ProductDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ProductDto>> Create(ProductEditDto dto)
    {
        var product = await productService.Create(dto);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    /// <summary>
    /// Изменяет товар (включая минимальный остаток).
    /// </summary>
    /// <param name="id">Идентификатор товара</param>
    /// <param name="dto">Данные формы товара</param>
    [HttpPut("{id:guid}")]
    [ProducesResponseType<ProductDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<ProductDto>> Update(Guid id, ProductEditDto dto) =>
        Ok(await productService.Update(id, dto));

    /// <summary>
    /// Снимает товар с продажи (isActive = false) или возвращает в продажу (isActive = true).
    /// </summary>
    /// <param name="id">Идентификатор товара</param>
    /// <param name="dto">Новое значение признака «в продаже»</param>
    [HttpPatch("{id:guid}/active")]
    [ProducesResponseType<ProductDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDto>> SetActive(Guid id, ProductActiveDto dto) =>
        Ok(await productService.SetActive(id, dto.IsActive!.Value));
}
