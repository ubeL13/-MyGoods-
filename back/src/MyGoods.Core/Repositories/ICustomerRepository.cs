using MyGoods.Core.Entities;

namespace MyGoods.Core.Repositories;

/// <summary>
/// Репозиторий покупателей.
/// </summary>
public interface ICustomerRepository : IRepository<Customer>
{
    /// <summary>
    /// Проверяет, есть ли покупатель с таким телефоном.
    /// </summary>
    /// <param name="phone">Телефон в нормализованном виде (79991234567)</param>
    Task<bool> PhoneExists(string phone);

    /// <summary>
    /// Поиск покупателей по имени или части телефона с пагинацией. Фильтрация выполняется в базе.
    /// </summary>
    /// <param name="search">Часть имени или цифры телефона (необязательно)</param>
    /// <param name="page">Номер страницы (с 1)</param>
    /// <param name="limit">Покупателей на странице</param>
    /// <returns>Покупатели страницы и общее количество найденных</returns>
    Task<(List<Customer> Items, int Total)> Search(string? search, int page, int limit);
}