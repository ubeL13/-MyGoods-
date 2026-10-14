namespace MyGoods.Dto.Categories;

/// <summary>
/// Категория в ответе API вместе с подкатегориями.
/// </summary>
/// <param name="Id">Идентификатор категории</param>
/// <param name="Name">Название</param>
/// <param name="Description">Описание</param>
/// <param name="ParentId">Родительская категория (null — верхний уровень)</param>
/// <param name="Children">Подкатегории</param>
public record CategoryDto(
    Guid Id,
    string Name,
    string? Description,
    Guid? ParentId,
    List<CategoryDto> Children);
