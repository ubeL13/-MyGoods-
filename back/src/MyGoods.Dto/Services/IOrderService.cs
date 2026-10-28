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
}
