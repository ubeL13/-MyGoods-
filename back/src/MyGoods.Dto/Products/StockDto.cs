namespace MyGoods.Dto.Products;

/// <summary>
/// Остаток товара на складе в ответе API.
/// </summary>
/// <param name="Quantity">Текущее количество на складе</param>
/// <param name="Min">Минимальный остаток</param>
/// <param name="Status">Статус по доступному количеству: Available — в наличии, LessMinimum — заканчивается, OutOfStock — нет в наличии</param>
/// <param name="Reserved">Зарезервировано в неотправленных заказах</param>
/// <param name="Available">Доступно к заказу (на складе минус зарезервировано)</param>
public record StockDto(int Quantity, int Min, string Status, int Reserved, int Available);
