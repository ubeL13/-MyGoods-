using MyGoods.Dto.Supplies;

namespace MyGoods.Dto.Services;

/// <summary>
/// Сервис поставок: оформление, приёмка товара на склад и отмена.
/// </summary>
public interface ISupplyService
{
    /// <summary>
    /// Поставка по идентификатору — с поставщиком и позициями. Если нет — NotFoundException (404).
    /// </summary>
    /// <param name="id">Идентификатор поставки</param>
    Task<SupplyDto> GetById(Guid id);

    /// <summary>
    /// Оформляет поставку в статусе «Оформлена». Остатки на складе не меняются до приёмки.
    /// </summary>
    /// <param name="dto">Данные поставки</param>
    /// <returns>Оформленная поставка</returns>
    Task<SupplyDto> Create(SupplyCreateDto dto);

    /// <summary>
    /// Принимает поставку: остаток каждого товара увеличивается на фактически принятое количество.
    /// Поставки нет — NotFoundException (404); уже принята или отменена — ConflictException (409).
    /// </summary>
    /// <param name="id">Идентификатор поставки</param>
    /// <param name="dto">Принятое количество по позициям</param>
    /// <returns>Принятая поставка</returns>
    Task<SupplyDto> Receive(Guid id, SupplyReceiveDto dto);

    /// <summary>
    /// Отменяет поставку, если она ещё не принята. Остатки не меняются.
    /// </summary>
    /// <param name="id">Идентификатор поставки</param>
    /// <returns>Отменённая поставка</returns>
    Task<SupplyDto> Cancel(Guid id);
}
