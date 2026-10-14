namespace MyGoods.Dto;

/// <summary>
/// Одна страница списка.
/// </summary>
/// <typeparam name="T">Тип элемента</typeparam>
/// <param name="Data">Элементы текущей страницы</param>
/// <param name="Meta">Сведения о страницах</param>
public record PagedResult<T>(List<T> Data, PageMeta Meta);

/// <summary>
/// Сведения о пагинации.
/// </summary>
/// <param name="Page">Номер текущей страницы</param>
/// <param name="Limit">Элементов на странице</param>
/// <param name="Total">Всего подходящих элементов</param>
/// <param name="TotalPages">Всего страниц</param>
public record PageMeta(int Page, int Limit, int Total, int TotalPages);
