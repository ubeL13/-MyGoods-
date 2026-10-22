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
}
