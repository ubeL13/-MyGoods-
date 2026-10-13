namespace MyGoods.Dto.Products;

/// <summary>
/// Остаток товара на складе в ответе API.
/// </summary>
/// <param name="Quantity">Текущее количество</param>
/// <param name="Min">Минимальный остаток</param>
/// <param name="Status">Статус: Available — в наличии, LessMinimum — заканчивается, OutOfStock — нет в наличии</param>
public record StockDto(int Quantity, int Min, string Status);
