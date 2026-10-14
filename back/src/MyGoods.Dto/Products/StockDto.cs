namespace MyGoods.Dto.Products;

/// <summary>
/// Остаток товара на складе в ответе API.
/// </summary>
/// <param name="Quantity">Текущее количество</param>
/// <param name="Min">Минимальный остаток</param>
public record StockDto(int Quantity, int Min);
