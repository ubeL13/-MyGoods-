using MyGoods.Dto.Orders;

namespace MyGoods.Dto.Services;

/// <summary>
/// Сервис заказов: создание заказа и смена его статуса.
/// </summary>
public interface IOrderService
{
    /// <summary>
    /// Создаёт заказ в статусе «Новый». Цена каждой позиции фиксируется на момент создания.
    /// </summary>
    /// <param name="dto">Данные заказа</param>
    /// <returns>Созданный заказ</returns>
    Task<OrderDto> Create(OrderCreateDto dto);

    /// <summary>
    /// Меняет статус заказа, если такой переход разрешён (например, «Новый» → «Подтверждён»).
    /// Заказа нет — NotFoundException (404); переход запрещён — ConflictException (409).
    /// </summary>
    /// <param name="id">Идентификатор заказа</param>
    /// <param name="dto">Новый статус</param>
    /// <returns>Заказ с новым статусом</returns>
    Task<OrderDto> ChangeStatus(Guid id, OrderStatusChangeDto dto);
}
