using System.ComponentModel.DataAnnotations;

namespace MyGoods.Dto.Products;

/// <summary>
/// Параметры каталога товаров (строка запроса GET /api/v1/products). Все параметры необязательные.
/// </summary>
public class ProductQueryDto
{
    /// <summary>
    /// Поиск по части названия или артикула.
    /// </summary>
    [MaxLength(200, ErrorMessage = "Поисковый запрос не длиннее 200 символов.")]
    public string? Search { get; set; }

    /// <summary>
    /// Категория. Показываются товары этой категории и всех её подкатегорий.
    /// </summary>
    public Guid? CategoryId { get; set; }

    /// <summary>
    /// Цена от.
    /// </summary>
    [Range(0, 9999999999.99, ErrorMessage = "Цена «от» не может быть отрицательной.")]
    public decimal? MinPrice { get; set; }

    /// <summary>
    /// Цена до.
    /// </summary>
    [Range(0, 9999999999.99, ErrorMessage = "Цена «до» не может быть отрицательной.")]
    public decimal? MaxPrice { get; set; }

    /// <summary>
    /// Только товары в наличии (количество больше 0).
    /// </summary>
    public bool InStock { get; set; }

    /// <summary>
    /// True — только в продаже, false — только снятые с продажи, не указано — все.
    /// </summary>
    public bool? IsActive { get; set; }

    /// <summary>
    /// Поле сортировки: name (по умолчанию), price, stock, createdAt.
    /// </summary>
    [AllowedValues("name", "price", "stock", "createdAt", ErrorMessage = "sortBy: допустимо name, price, stock, createdAt.")]
    public string SortBy { get; set; } = "name";

    /// <summary>
    /// Направление сортировки: asc (по умолчанию) или desc.
    /// </summary>
    [AllowedValues("asc", "desc", ErrorMessage = "sortOrder: допустимо asc или desc.")]
    public string SortOrder { get; set; } = "asc";

    /// <summary>
    /// Номер страницы, начиная с 1.
    /// </summary>
    [Range(1, int.MaxValue, ErrorMessage = "Номер страницы — от 1.")]
    public int Page { get; set; } = 1;

    /// <summary>
    /// Товаров на странице (1–100, по умолчанию 20).
    /// </summary>
    [Range(1, 100, ErrorMessage = "На странице от 1 до 100 товаров.")]
    public int Limit { get; set; } = 20;
}
