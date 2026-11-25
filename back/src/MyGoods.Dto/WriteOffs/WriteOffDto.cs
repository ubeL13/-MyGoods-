namespace MyGoods.Dto.WriteOffs;

/// <summary>Заявка на списание в ответе API.</summary>
/// <param name="Id">Идентификатор</param>
/// <param name="Number">Номер заявки</param>
/// <param name="ProductId">Идентификатор товара</param>
/// <param name="Sku">Артикул товара</param>
/// <param name="ProductName">Название товара</param>
/// <param name="Quantity">Количество</param>
/// <param name="Reason">Причина списания</param>
/// <param name="Comment">Комментарий</param>
/// <param name="Status">Статус заявки</param>
/// <param name="CreatedBy">Кто создал</param>
/// <param name="CreatedAt">Дата создания</param>
/// <param name="ReviewedAt">Дата рассмотрения</param>
/// <param name="RejectionReason">Причина отклонения</param>
public record WriteOffDto(
    Guid Id,
    int Number,
    Guid ProductId,
    string? Sku,
    string? ProductName,
    int Quantity,
    string Reason,
    string? Comment,
    string Status,
    string CreatedBy,
    DateTime CreatedAt,
    DateTime? ReviewedAt,
    string? RejectionReason);