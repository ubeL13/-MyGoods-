using MyGoods.Application.Exceptions;
using MyGoods.Application.Services;
using MyGoods.Core.Entities;
using MyGoods.Dto.Products;
using MyGoods.Tests.Fakes;

namespace MyGoods.Tests;

/// <summary>
/// Тесты сервиса товаров: валидация, уникальность артикула, снятие с продажи, каталог.
/// Вместо базы данных используются заглушки репозиториев со списками в памяти.
/// </summary>
public class ProductServiceTests
{
    private readonly FakeProductRepository _products = new();
    private readonly FakeCategoryRepository _categories = new();
    private readonly ProductService _service;

    private readonly Category _phones = new() { Id = Guid.NewGuid(), Name = "Смартфоны" };
    private readonly Category _laptops = new() { Id = Guid.NewGuid(), Name = "Ноутбуки" };

    /// <summary>
    /// Перед каждым тестом: две категории и сервис поверх заглушек.
    /// </summary>
    public ProductServiceTests()
    {
        _categories.Categories.AddRange([_phones, _laptops]);
        _service = new ProductService(_products, _categories);
    }

    /// <summary>
    /// Данные формы товара по умолчанию.
    /// </summary>
    private ProductEditDto Form(string sku = "PHN-001", Guid? categoryId = null, int min = 5) => new()
    {
        CategoryId = categoryId ?? _phones.Id,
        Sku = sku,
        Name = "Смартфон Samsung Galaxy A55",
        Price = 34990m,
        Description = "Тестовый товар",
        Manufacturer = "Samsung",
        Min = min
    };

    /// <summary>
    /// Новый товар создаётся в продаже, с нулевым остатком и минимумом из формы.
    /// </summary>
    [Fact]
    public async Task Create_NewProduct_IsActiveWithZeroStock()
    {
        var product = await _service.Create(Form(min: 7));

        Assert.True(product.IsActive);
        Assert.NotNull(product.Stock);
        Assert.Equal(0, product.Stock.Quantity);
        Assert.Equal(7, product.Stock.Min);
        Assert.Equal("OutOfStock", product.Stock.Status);
        Assert.Single(_products.Products);
    }

    /// <summary>
    /// Пробелы по краям артикула обрезаются.
    /// </summary>
    [Fact]
    public async Task Create_TrimsSku()
    {
        var product = await _service.Create(Form(sku: "  PHN-001  "));

        Assert.Equal("PHN-001", product.Sku);
    }

    /// <summary>
    /// Нельзя создать товар с артикулом, который уже занят.
    /// </summary>
    [Fact]
    public async Task Create_DuplicateSku_ThrowsConflict()
    {
        await _service.Create(Form(sku: "PHN-001"));

        await Assert.ThrowsAsync<ConflictException>(() => _service.Create(Form(sku: "PHN-001")));
        Assert.Single(_products.Products);
    }

    /// <summary>
    /// Нельзя создать товар в несуществующей категории.
    /// </summary>
    [Fact]
    public async Task Create_UnknownCategory_ThrowsValidation()
    {
        await Assert.ThrowsAsync<ValidationException>(() => _service.Create(Form(categoryId: Guid.NewGuid())));
        Assert.Empty(_products.Products);
    }

    /// <summary>
    /// При редактировании можно оставить товару его же артикул и сменить категорию и минимум.
    /// </summary>
    [Fact]
    public async Task Update_SameSku_ChangesCategoryAndMin()
    {
        var created = await _service.Create(Form(sku: "PHN-001"));

        var updated = await _service.Update(created.Id, Form(sku: "PHN-001", categoryId: _laptops.Id, min: 2));

        Assert.Equal(_laptops.Id, updated.CategoryId);
        Assert.Equal("Ноутбуки", updated.CategoryName);
        Assert.Equal(2, updated.Stock!.Min);
    }

    /// <summary>
    /// При редактировании нельзя взять артикул другого товара.
    /// </summary>
    [Fact]
    public async Task Update_SkuOfAnotherProduct_ThrowsConflict()
    {
        await _service.Create(Form(sku: "PHN-001"));
        var second = await _service.Create(Form(sku: "PHN-002"));

        await Assert.ThrowsAsync<ConflictException>(() => _service.Update(second.Id, Form(sku: "PHN-001")));
    }

    /// <summary>
    /// Изменение несуществующего товара — NotFound.
    /// </summary>
    [Fact]
    public async Task Update_UnknownProduct_ThrowsNotFound()
    {
        await Assert.ThrowsAsync<NotFoundException>(() => _service.Update(Guid.NewGuid(), Form()));
    }

    /// <summary>
    /// Снятие с продажи меняет признак IsActive, но товар не удаляется; возврат в продажу работает.
    /// </summary>
    [Fact]
    public async Task SetActive_DeactivatesAndReactivatesWithoutDeleting()
    {
        var created = await _service.Create(Form());

        var deactivated = await _service.SetActive(created.Id, false);
        Assert.False(deactivated.IsActive);
        Assert.Single(_products.Products);

        var reactivated = await _service.SetActive(created.Id, true);
        Assert.True(reactivated.IsActive);
    }

    /// <summary>
    /// Снятие с продажи несуществующего товара — NotFound.
    /// </summary>
    [Fact]
    public async Task SetActive_UnknownProduct_ThrowsNotFound()
    {
        await Assert.ThrowsAsync<NotFoundException>(() => _service.SetActive(Guid.NewGuid(), false));
    }

    /// <summary>
    /// Фильтр каталога по категории включает все её подкатегории на любой глубине.
    /// </summary>
    [Fact]
    public async Task GetCatalog_CategoryFilter_IncludesSubcategories()
    {
        var electronics = new Category { Id = Guid.NewGuid(), Name = "Электроника" };
        _phones.ParentId = electronics.Id;
        var android = new Category { Id = Guid.NewGuid(), Name = "Android", ParentId = _phones.Id };
        _categories.Categories.AddRange([electronics, android]);

        await _service.GetCatalog(new ProductQueryDto { CategoryId = electronics.Id });

        var ids = _products.LastFilter!.CategoryIds!;
        Assert.Contains(electronics.Id, ids);
        Assert.Contains(_phones.Id, ids);
        Assert.Contains(android.Id, ids);
        Assert.DoesNotContain(_laptops.Id, ids);
    }

    /// <summary>
    /// Каталог по несуществующей категории — ошибка валидации.
    /// </summary>
    [Fact]
    public async Task GetCatalog_UnknownCategory_ThrowsValidation()
    {
        await Assert.ThrowsAsync<ValidationException>(() =>
            _service.GetCatalog(new ProductQueryDto { CategoryId = Guid.NewGuid() }));
    }

    /// <summary>
    /// Число страниц считается с округлением вверх.
    /// </summary>
    [Fact]
    public async Task GetCatalog_CalculatesTotalPages()
    {
        for (var i = 1; i <= 5; i++)
            await _service.Create(Form(sku: $"PHN-00{i}"));

        var page = await _service.GetCatalog(new ProductQueryDto { Page = 1, Limit = 2 });

        Assert.Equal(5, page.Meta.Total);
        Assert.Equal(3, page.Meta.TotalPages);
    }
}
