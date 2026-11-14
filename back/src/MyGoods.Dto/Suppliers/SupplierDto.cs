namespace MyGoods.Dto.Suppliers;

/// <summary>
/// Поставщик в ответе API.
/// </summary>
/// <param name="Id">Идентификатор поставщика</param>
/// <param name="Name">Наименование поставщика</param>
/// <param name="Inn">ИНН поставщика</param>
/// <param name="ContactPerson">Контактное лицо</param>
/// <param name="Phone">Телефон поставщика</param>
/// <param name="Email">Электронная почта</param>
/// <param name="Address">Адрес поставщика</param>
/// <param name="IsActive">Признак активности (архив)</param>
/// <param name="CreatedAt">Дата создания (UTC)</param>
/// <param name="UpdatedAt">Дата последнего изменения (UTC)</param>
public record SupplierDto(
    Guid Id,
    string Name,
    string? Inn,
    string? ContactPerson,
    string Phone,
    string? Email,
    string? Address,
    bool IsActive,
    DateTime CreatedAt,
    DateTime UpdatedAt);