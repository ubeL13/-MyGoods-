using MyGoods.Dto.Categories;

namespace MyGoods.Dto.Services;

/// <summary>
/// Сервис категорий: дерево категорий и бизнес-правила изменения.
/// </summary>
public interface ICategoryService
{
    /// <summary>
    /// Возвращает все категории в виде дерева: категории верхнего уровня, внутри — подкатегории.
    /// </summary>
    Task<List<CategoryDto>> GetTree();

    /// <summary>
    /// Возвращает категорию со всеми подкатегориями. Если категории нет — NotFoundException (404).
    /// </summary>
    /// <param name="id">Идентификатор категории</param>
    Task<CategoryDto> GetById(Guid id);

    /// <summary>
    /// Создаёт категорию.
    /// </summary>
    /// <param name="dto">Данные формы категории</param>
    /// <returns>Созданная категория</returns>
    Task<CategoryDto> Create(CategoryEditDto dto);

    /// <summary>
    /// Изменяет категорию (название, описание, родителя).
    /// </summary>
    /// <param name="id">Идентификатор категории</param>
    /// <param name="dto">Данные формы категории</param>
    /// <returns>Изменённая категория</returns>
    Task<CategoryDto> Update(Guid id, CategoryEditDto dto);

    /// <summary>
    /// Удаляет категорию. Нельзя удалить категорию с подкатегориями или товарами — ConflictException (409).
    /// </summary>
    /// <param name="id">Идентификатор категории</param>
    Task Delete(Guid id);
}
