using MyGoods.Dto.Orders;

namespace MyGoods.Dto.Customers;

/// <summary>
/// Карточка покупателя с его заказами и статистикой.
/// </summary>
/// <param name="Id">Идентификатор покупателя</param>
/// <param name="Name">Имя или наименование</param>
/// <param name="Phone">Телефон в виде 79991234567</param>
/// <param name="Email">Электронная почта</param>
/// <param name="Address">Адрес</param>
/// <param name="CreatedAt">Дата создания (UTC)</param>
/// <param name="OrdersCount">Общее количество заказов</param>
/// <param name="OrdersTotal">Общая сумма неотменённых заказов</param>
/// <param name="Orders">Список заказов (новые сверху)</param>
public record CustomerDetailsDto(
    Guid Id,
    string Name,
    string Phone,
    string? Email,
    string? Address,
    DateTime CreatedAt,
    int OrdersCount,
    decimal OrdersTotal,
    List<OrderListItemDto> Orders);