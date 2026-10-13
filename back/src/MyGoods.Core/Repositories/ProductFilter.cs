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
}
