namespace MyGoods.Dto.Products;

/// <summary>
/// Фотография товара в ответе API.
/// </summary>
/// <param name="Id">Идентификатор фотографии</param>
/// <param name="Url">Адрес файла</param>
/// <param name="IsMain">Главная фотография</param>
public record ProductImageDto(Guid Id, string Url, bool IsMain);
