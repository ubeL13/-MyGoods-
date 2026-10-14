using MyGoods.Application.Exceptions;
using MyGoods.Core.Entities;
using MyGoods.Core.Repositories;
using MyGoods.Dto.Categories;
using MyGoods.Dto.Services;

namespace MyGoods.Application.Services;

/// <summary>
/// Сервис категорий: строит дерево и проверяет бизнес-правила перед сохранением.
/// </summary>
/// <param name="categoryRepository">Репозиторий категорий</param>
public class CategoryService(ICategoryRepository categoryRepository) : ICategoryService
{
    /// <inheritdoc />
    public async Task<List<CategoryDto>> GetTree()
    {
        // Категорий немного — загружаем все одним запросом и собираем дерево в памяти
        var categories = await categoryRepository.Read();
        return BuildChildren(categories, parentId: null);
    }

    /// <inheritdoc />
    public async Task<CategoryDto> GetById(Guid id)
    {
        var categories = await categoryRepository.Read();
        var category = categories.FirstOrDefault(c => c.Id == id)
            ?? throw new NotFoundException($"Категория с id {id} не найдена.");

        return ToDto(category, categories);
    }

    /// <inheritdoc />
    public async Task<CategoryDto> Create(CategoryEditDto dto)
    {
        var name = dto.Name.Trim();

        if (await categoryRepository.NameExists(name))
            throw new ConflictException($"Категория «{name}» уже существует.");

        if (dto.ParentId.HasValue && await categoryRepository.Read(dto.ParentId.Value) == null)
            throw new ValidationException($"Родительская категория с id {dto.ParentId} не существует.");

        var category = new Category
        {
            Name = name,
            Description = dto.Description?.Trim(),
            ParentId = dto.ParentId
        };

        await categoryRepository.Create(category);
        return new CategoryDto(category.Id, category.Name, category.Description, category.ParentId, []);
    }

    /// <inheritdoc />
    public async Task<CategoryDto> Update(Guid id, CategoryEditDto dto)
    {
        var category = await categoryRepository.Read(id)
            ?? throw new NotFoundException($"Категория с id {id} не найдена.");

        var name = dto.Name.Trim();
        if (await categoryRepository.NameExists(name, excludeCategoryId: id))
            throw new ConflictException($"Категория «{name}» уже существует.");

        if (dto.ParentId.HasValue)
            await CheckNewParent(id, dto.ParentId.Value);

        category.Name = name;
        category.Description = dto.Description?.Trim();
        category.ParentId = dto.ParentId;

        await categoryRepository.Update(category);
        return await GetById(id);
    }

    /// <inheritdoc />
    public async Task Delete(Guid id)
    {
        var category = await categoryRepository.Read(id)
            ?? throw new NotFoundException($"Категория с id {id} не найдена.");

        if (await categoryRepository.HasChildren(id))
            throw new ConflictException($"Нельзя удалить категорию «{category.Name}»: у неё есть подкатегории.");

        if (await categoryRepository.HasProducts(id))
            throw new ConflictException($"Нельзя удалить категорию «{category.Name}»: в ней есть товары.");

        await categoryRepository.Delete(id);
    }

    /// <summary>
    /// Проверяет нового родителя: он должен существовать и не может быть самой категорией
    /// или её подкатегорией — иначе в дереве получится цикл.
    /// </summary>
    /// <param name="categoryId">Изменяемая категория</param>
    /// <param name="parentId">Новый родитель</param>
    private async Task CheckNewParent(Guid categoryId, Guid parentId)
    {
        if (parentId == categoryId)
            throw new ValidationException("Категория не может быть родителем самой себя.");

        var categories = await categoryRepository.Read();

        if (categories.All(c => c.Id != parentId))
            throw new ValidationException($"Родительская категория с id {parentId} не существует.");

        // Обход в ширину: собираем все подкатегории изменяемой категории
        var descendants = new List<Guid> { categoryId };
        for (var i = 0; i < descendants.Count; i++)
        {
            var current = descendants[i];
            descendants.AddRange(categories.Where(c => c.ParentId == current).Select(c => c.Id));
        }

        if (descendants.Contains(parentId))
            throw new ValidationException("Нельзя перенести категорию внутрь её собственной подкатегории.");
    }

    /// <summary>
    /// Категория → CategoryDto вместе со всеми подкатегориями.
    /// </summary>
    /// <param name="category">Категория</param>
    /// <param name="all">Все категории (из них берутся подкатегории)</param>
    private static CategoryDto ToDto(Category category, List<Category> all) =>
        new(category.Id, category.Name, category.Description, category.ParentId, BuildChildren(all, category.Id));

    /// <summary>
    /// Рекурсивно строит список подкатегорий указанного родителя, по алфавиту.
    /// </summary>
    /// <param name="all">Все категории</param>
    /// <param name="parentId">Родитель (null — категории верхнего уровня)</param>
    private static List<CategoryDto> BuildChildren(List<Category> all, Guid? parentId) =>
        all.Where(c => c.ParentId == parentId)
            .OrderBy(c => c.Name)
            .Select(c => ToDto(c, all))
            .ToList();
}
