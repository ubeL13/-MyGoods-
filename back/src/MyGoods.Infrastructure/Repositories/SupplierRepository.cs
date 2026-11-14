using Microsoft.EntityFrameworkCore;
using MyGoods.Core.Entities;
using MyGoods.Core.Repositories;
using MyGoods.Infrastructure.Data;

namespace MyGoods.Infrastructure.Repositories;

/// <summary>
/// Репозиторий поставщиков.
/// </summary>
/// <param name="dbContext">Контекст базы данных</param>
public class SupplierRepository(AppDbContext dbContext) : Repository<Supplier>(dbContext), ISupplierRepository
{
    /// <inheritdoc />
    public async Task<(List<Supplier> Items, int Total)> Search(string? search, int page, int limit)
    {
        var query = Set.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var text = search.Trim();
            var pattern = $"%{text}%";
            var digits = new string(text.Where(char.IsDigit).ToArray());

            // Ищем по названию, ИНН или телефону (только цифры)
            query = query.Where(s => 
                EF.Functions.ILike(s.Name, pattern) || 
                (s.Inn != null && s.Inn.Contains(digits)) ||
                (s.Phone != null && s.Phone.Contains(digits)));
        }

        var total = await query.CountAsync();

        var items = await query
            .OrderBy(s => s.Name)
            .ThenBy(s => s.Id)
            .Skip((page - 1) * limit)
            .Take(limit)
            .AsNoTracking()
            .ToListAsync();

        return (items, total);
    }

    /// <inheritdoc />
    public async Task<bool> NameExists(string name, Guid? excludeId = null)
    {
        // ILike делает проверку без учета регистра
        var query = Set.Where(s => EF.Functions.ILike(s.Name, name));

        if (excludeId.HasValue)
        {
            query = query.Where(s => s.Id != excludeId.Value);
        }

        return await query.AnyAsync();
    }
}
