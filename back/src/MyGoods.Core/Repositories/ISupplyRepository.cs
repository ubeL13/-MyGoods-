using MyGoods.Core.Entities;
using MyGoods.Core.Enums;

namespace MyGoods.Core.Repositories;

/// <summary>
/// Репозиторий поставок: базовый CRUD, загрузка поставки с позициями, приёмка и отмена.
/// </summary>
public interface ISupplyRepository : IRepository<Supply>
{
    /// <summary>
    /// Список поставок с фильтрами, поиском и пагинацией; новые сверху. Фильтрация выполняется в базе.
    /// </summary>
    /// <param name="status">Статус (необязательно)</param>
    /// <param name="supplierId">Поставщик (необязательно)</param>
    /// <param name="search">Номер поставки или часть названия поставщика (необязательно)</param>
    /// <param name="page">Номер страницы (с 1)</param>
    /// <param name="limit">Поставок на странице</param>
    /// <returns>Поставки страницы и общее количество найденных</returns>
    Task<(List<Supply> Items, int Total)> Search(SupplyStatus? status, Guid? supplierId, string? search, int page, int limit);

    /// <summary>
    /// В одной транзакции переводит поставку из «Оформлена» в «Принята», увеличивает остатки товаров
    /// на принятое количество и сохраняет принятое количество в позициях.
    /// Если поставку уже приняли или отменили (например, параллельным запросом), ничего не меняется.
    /// </summary>
    /// <param name="supply">Поставка со статусом «Принята» и заполненным принятым количеством</param>
    /// <returns>True — принята; false — поставка уже не в статусе «Оформлена»</returns>
    Task<bool> SaveReceived(Supply supply);

    /// <summary>
    /// Переводит поставку из «Оформлена» в «Отменена». Остатки не меняются.
    /// Если поставку уже приняли или отменили, ничего не меняется.
    /// </summary>
    /// <param name="supply">Поставка со статусом «Отменена»</param>
    /// <returns>True — отменена; false — поставка уже не в статусе «Оформлена»</returns>
    Task<bool> SaveCancelled(Supply supply);
}
