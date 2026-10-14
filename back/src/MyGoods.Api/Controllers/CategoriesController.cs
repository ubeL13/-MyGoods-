using Microsoft.AspNetCore.Mvc;
using MyGoods.Dto.Categories;
using MyGoods.Dto.Services;

namespace MyGoods.Api.Controllers;

/// <summary>
/// Категории товаров: дерево, создание, редактирование, удаление.
/// </summary>
/// <param name="categoryService">Сервис категорий</param>
[ApiController]
[Route("api/v1/categories")]
public class CategoriesController(ICategoryService categoryService) : ControllerBase
{
    /// <summary>
    /// Возвращает все категории деревом: категории верхнего уровня, внутри — подкатегории (children).
    /// </summary>
    [HttpGet]
    [ProducesResponseType<List<CategoryDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<List<CategoryDto>>> GetTree() =>
        Ok(await categoryService.GetTree());

    /// <summary>
    /// Возвращает категорию со всеми подкатегориями.
    /// </summary>
    /// <param name="id">Идентификатор категории</param>
    [HttpGet("{id:guid}")]
    [ProducesResponseType<CategoryDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CategoryDto>> GetById(Guid id) =>
        Ok(await categoryService.GetById(id));

    /// <summary>
    /// Создаёт категорию.
    /// </summary>
    /// <param name="dto">Данные формы категории</param>
    [HttpPost]
    [ProducesResponseType<CategoryDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<CategoryDto>> Create(CategoryEditDto dto)
    {
        var category = await categoryService.Create(dto);
        return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
    }

    /// <summary>
    /// Изменяет категорию (название, описание, родителя).
    /// </summary>
    /// <param name="id">Идентификатор категории</param>
    /// <param name="dto">Данные формы категории</param>
    [HttpPut("{id:guid}")]
    [ProducesResponseType<CategoryDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<CategoryDto>> Update(Guid id, CategoryEditDto dto) =>
        Ok(await categoryService.Update(id, dto));

    /// <summary>
    /// Удаляет категорию. Категорию с подкатегориями или товарами удалить нельзя (409).
    /// </summary>
    /// <param name="id">Идентификатор категории</param>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await categoryService.Delete(id);
        return NoContent();
    }
}
