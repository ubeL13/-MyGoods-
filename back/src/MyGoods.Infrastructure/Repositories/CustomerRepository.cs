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

    /// <inheritdoc />
    public async Task<(List<Customer> Items, int Total)> Search(string? search, int page, int limit)
    {
        var query = Set.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var pattern = $"%{search.Trim()}%";
            // Телефон хранится только цифрами, поэтому из запроса тоже берём только цифры
            var digits = new string(search.Where(char.IsDigit).ToArray());

            query = digits.Length > 0
                ? query.Where(c => EF.Functions.ILike(c.Name, pattern) || c.Phone.Contains(digits))
                : query.Where(c => EF.Functions.ILike(c.Name, pattern));
        }

        var total = await query.CountAsync();

        var items = await query
            .OrderBy(c => c.Name)
            .ThenBy(c => c.Id)
            .Skip((page - 1) * limit)
            .Take(limit)
            .AsNoTracking()
            .ToListAsync();

        return (items, total);
    }
}