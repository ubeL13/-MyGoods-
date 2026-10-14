using MyGoods.Core.Entities;
using MyGoods.Dto.Products;

namespace MyGoods.Application.Helpers;

/// <summary>
/// Ручное преобразование сущностей в DTO.
/// </summary>
public static class MapperHelper
{
    /// <summary>
    /// Товар → ProductDto.
    /// </summary>
    public static ProductDto ToDto(Product product) =>
        new(
            product.Id,
            product.CategoryId,
            product.Category?.Name,
            product.Sku,
            product.Name,
            product.Price,
            product.Description,
            product.Manufacturer,
            product.IsActive,
            product.CreatedAt,
            product.UpdatedAt,
            product.RemainingProduct == null ? null : ToDto(product.RemainingProduct));

    /// <summary>
    /// Остаток → StockDto.
    /// </summary>
    public static StockDto ToDto(RemainingProduct stock) =>
        new(stock.Quantity, stock.Min);
}
