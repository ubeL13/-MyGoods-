using MyGoods.Application.Exceptions;
using MyGoods.Application.Helpers;
using MyGoods.Core.Entities;
using MyGoods.Core.Repositories;
using MyGoods.Dto;
using MyGoods.Dto.Products;
using MyGoods.Dto.Services;

namespace MyGoods.Application.Services;

/// <summary>
/// Сервис товаров: проверяет бизнес-правила и сохраняет товар через репозиторий.
/// </summary>
/// <param name="productRepository">Репозиторий товаров</param>
/// <param name="categoryRepository">Репозиторий категорий</param>
public class ProductService(
    IProductRepository productRepository,
    IRepository<Category> categoryRepository) : IProductService
{
    /// <inheritdoc />
    public async Task<PagedResult<ProductDto>> GetCatalog(ProductQueryDto query)
    {
        var filter = new ProductFilter
        {
            Search = query.Search,
            MinPrice = query.MinPrice,
            MaxPrice = query.MaxPrice,
            InStockOnly = query.InStock,
            IsActive = query.IsActive,
            SortBy = query.SortBy,
            Descending = query.SortOrder == "desc",
            Page = query.Page,
            Limit = query.Limit,
            BelowMinOnly = query.BelowMin
        };

        if (query.CategoryId.HasValue)
            filter.CategoryIds = await GetCategoryWithDescendants(query.CategoryId.Value);

        var (items, total) = await productRepository.GetCatalog(filter);

        var totalPages = (int)Math.Ceiling(total / (double)query.Limit);
        return new PagedResult<ProductDto>(
            items.Select(MapperHelper.ToDto).ToList(),
            new PageMeta(query.Page, query.Limit, total, totalPages));
    }

    /// <inheritdoc />
    public async Task<ProductDto> GetById(Guid id)
    {
        var product = await productRepository.Read(id)
            ?? throw new NotFoundException($"Товар с id {id} не найден.");

        return MapperHelper.ToDto(product);
    }

    /// <inheritdoc />
    public async Task<ProductDto> Create(ProductEditDto dto)
    {
        var category = await GetCategory(dto.CategoryId!.Value);
        var sku = dto.Sku.Trim();

        if (await productRepository.SkuExists(sku))
            throw new ConflictException($"Артикул «{sku}» уже занят другим товаром.");

        var now = DateTime.UtcNow;
        var product = new Product
        {
            CategoryId = category.Id,
            Category = category,
            Sku = sku,
            Name = dto.Name.Trim(),
            Price = dto.Price,
            Description = dto.Description.Trim(),
            Manufacturer = dto.Manufacturer.Trim(),
            IsActive = true,
            CreatedAt = now,
            UpdatedAt = now,
            // Новый товар ещё не поступал на склад — остаток 0
            RemainingProduct = new RemainingProduct { Quantity = 0, Min = dto.Min }
        };

        await productRepository.Create(product);
        return MapperHelper.ToDto(product);
    }

    /// <inheritdoc />
    public async Task<ProductDto> Update(Guid id, ProductEditDto dto)
    {
        var product = await productRepository.Read(id)
            ?? throw new NotFoundException($"Товар с id {id} не найден.");

        var category = await GetCategory(dto.CategoryId!.Value);
        var sku = dto.Sku.Trim();

        if (await productRepository.SkuExists(sku, excludeProductId: id))
            throw new ConflictException($"Артикул «{sku}» уже занят другим товаром.");

        product.CategoryId = category.Id;
        product.Category = category;
        product.Sku = sku;
        product.Name = dto.Name.Trim();
        product.Price = dto.Price;
        product.Description = dto.Description.Trim();
        product.Manufacturer = dto.Manufacturer.Trim();
        product.UpdatedAt = DateTime.UtcNow;

        product.RemainingProduct ??= new RemainingProduct();
        product.RemainingProduct.Min = dto.Min;

        await productRepository.Update(product);
        return MapperHelper.ToDto(product);
    }

    /// <inheritdoc />
    public async Task<ProductDto> SetActive(Guid id, bool isActive)
    {
        var product = await productRepository.Read(id)
            ?? throw new NotFoundException($"Товар с id {id} не найден.");

        product.IsActive = isActive;
        product.UpdatedAt = DateTime.UtcNow;

        await productRepository.Update(product);
        return MapperHelper.ToDto(product);
    }

    /// <summary>
    /// Возвращает идентификаторы категории и всех её подкатегорий на любой глубине.
    /// Категорий немного, поэтому они загружаются целиком, а дерево обходится в памяти.
    /// </summary>
    /// <param name="categoryId">Идентификатор выбранной категории</param>
    private async Task<List<Guid>> GetCategoryWithDescendants(Guid categoryId)
    {
        var categories = await categoryRepository.Read();

        if (categories.All(c => c.Id != categoryId))
            throw new ValidationException($"Категория с id {categoryId} не существует.");

        var result = new List<Guid> { categoryId };
        // Обход в ширину: берём детей уже найденных категорий, пока новые не закончатся
        for (var i = 0; i < result.Count; i++)
        {
            var parentId = result[i];
            result.AddRange(categories.Where(c => c.ParentId == parentId).Select(c => c.Id));
        }

        return result;
    }

    /// <summary>
    /// Находит категорию или бросает ValidationException, если её нет.
    /// </summary>
    /// <param name="categoryId">Идентификатор категории</param>
    private async Task<Category> GetCategory(Guid categoryId) =>
        await categoryRepository.Read(categoryId)
            ?? throw new ValidationException($"Категория с id {categoryId} не существует.");
}
