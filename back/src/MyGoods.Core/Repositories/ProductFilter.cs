namespace MyGoods.Core.Repositories;

/// <summary>
/// Условия выборки товаров для каталога. Все условия необязательные.
/// </summary>
public class ProductFilter
{
    /// <summary>
    /// Поиск по части названия или артикула (без учёта регистра).
    /// </summary>
    public string? Search { get; set; }

    /// <summary>
    /// Категории, товары которых нужно показать (выбранная категория и все её подкатегории).
    /// </summary>
    public List<Guid>? CategoryIds { get; set; }

    /// <summary>
    /// Цена от.
    /// </summary>
    public decimal? MinPrice { get; set; }

    /// <summary>
    /// Цена до.
    /// </summary>
    public decimal? MaxPrice { get; set; }

    /// <summary>
    /// Только товары, которые есть на складе (количество больше 0).
    /// </summary>
    public bool InStockOnly { get; set; }

    /// <summary>
    /// Фильтр по признаку «в продаже». Null — показывать все.
    /// </summary>
    public bool? IsActive { get; set; }

    /// <summary>
    /// Поле сортировки: name, price, stock, createdAt.
    /// </summary>
    public string SortBy { get; set; } = "name";

    /// <summary>
    /// Сортировка по убыванию.
    /// </summary>
    public bool Descending { get; set; }

    /// <summary>
    /// Номер страницы (с 1).
    /// </summary>
    public int Page { get; set; } = 1;

    /// <summary>
    /// Количество товаров на странице.
    /// </summary>
    public int Limit { get; set; } = 20;
    
    /// <summary>
    /// Показывать только товары, остаток которых не превышает минимальный уровень.
    /// </summary>
    public bool BelowMinOnly { get; set; }
}
