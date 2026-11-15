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
    public async Task<(List<Supplier> Items, int Total)> Search(string? search, bool? isActive, int page, int limit)
    {
        var query = Set.AsQueryable();

        // Фильтр по вкладкам "Активные / Архив"
        if (isActive.HasValue)
            query = query.Where(s => s.IsActive == isActive.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var text = search.Trim();
            var pattern = $"%{text}%";
            var digits = new string(text.Where(char.IsDigit).ToArray());

            // Исправленный поиск: если цифр нет, ищем только по имени и контактному лицу
            query = digits.Length > 0
                ? query.Where(s => EF.Functions.ILike(s.Name, pattern)
                                   || (s.ContactPerson != null && EF.Functions.ILike(s.ContactPerson, pattern))
                                   || (s.Inn != null && s.Inn.Contains(digits))
                                   || s.Phone.Contains(digits))
                : query.Where(s => EF.Functions.ILike(s.Name, pattern)
                                   || (s.ContactPerson != null && EF.Functions.ILike(s.ContactPerson, pattern)));
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

    public async Task<bool> NameExists(string name, Guid? excludeId = null)
    {
        // Исправление ложного дубля (без учета регистра, без трактовки _ и % как шаблонов)
        var lower = name.ToLower();
        var query = Set.Where(s => s.Name.ToLower() == lower);

        if (excludeId.HasValue)
            query = query.Where(s => s.Id != excludeId.Value);

        return await query.AnyAsync();
    }
}
