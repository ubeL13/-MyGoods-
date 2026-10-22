using Microsoft.EntityFrameworkCore;
using MyGoods.Core.Entities;
using MyGoods.Core.Repositories;
using MyGoods.Infrastructure.Data;

namespace MyGoods.Infrastructure.Repositories;

/// <summary>
/// Репозиторий покупателей.
/// </summary>
/// <param name="dbContext">Контекст базы данных</param>
public class CustomerRepository(AppDbContext dbContext) : Repository<Customer>(dbContext), ICustomerRepository
{
    /// <inheritdoc />
    public async Task<bool> PhoneExists(string phone) =>
        await Set.AnyAsync(c => c.Phone == phone);
}
