using MyGoods.Core.Entities;

namespace MyGoods.Core.Repositories;

/// <summary>
/// Репозиторий поставщиков.
/// </summary>
public interface ISupplierRepository : IRepository<Supplier>
{
    /// <summary>
    /// Список поставщиков с поиском и пагинацией.
    /// </summary>
    /// <param name="search">Поиск по названию, ИНН или телефону (необязательно)</param>
    /// <param name="page">Номер страницы (с 1)</param>
    /// <param name="limit">Поставщиков на странице</param>
    /// <returns>Поставщики страницы и общее количество найденных</returns>
    Task<(List<Supplier> Items, int Total)> Search(string? search, int page, int limit);

    /// <summary>
    /// Проверяет, существует ли поставщик с таким названием (без учета регистра).
    /// </summary>
    /// <param name="name">Название поставщика</param>
    /// <param name="excludeId">ID поставщика, которого нужно исключить из проверки (для редактирования)</param>
    Task<bool> NameExists(string name, Guid? excludeId = null);
}
