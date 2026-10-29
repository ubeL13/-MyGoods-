namespace MyGoods.Dto.Customers;

/// <summary>
/// Покупатель в ответе API.
/// </summary>
/// <param name="Id">Идентификатор покупателя</param>
/// <param name="Name">Имя или наименование</param>
/// <param name="Phone">Телефон в виде 79991234567</param>
/// <param name="Email">Электронная почта</param>
/// <param name="Address">Адрес</param>
/// <param name="CreatedAt">Дата создания (UTC)</param>
public record CustomerDto(
    Guid Id,
    string Name,
    string Phone,
    string? Email,
    string? Address,
    DateTime CreatedAt);
