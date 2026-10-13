namespace MyGoods.Dto.Products;

/// <summary>
/// Товар в ответе API.
/// </summary>
/// <param name="Id">Идентификатор товара</param>
/// <param name="CategoryId">Идентификатор категории</param>
/// <param name="CategoryName">Название категории</param>
/// <param name="Sku">Артикул</param>
/// <param name="Name">Название</param>
/// <param name="Price">Цена в рублях</param>
/// <param name="Description">Описание</param>
/// <param name="Manufacturer">Производитель</param>
/// <param name="IsActive">В продаже (false — снят с продажи)</param>
/// <param name="CreatedAt">Дата создания (UTC)</param>
/// <param name="UpdatedAt">Дата изменения (UTC)</param>
/// <param name="Stock">Остаток на складе</param>
public record ProductDto(
    Guid Id,
    Guid CategoryId,
    string? CategoryName,
    string Sku,
    string Name,
    decimal Price,
    string Description,
    string Manufacturer,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    StockDto? Stock);
