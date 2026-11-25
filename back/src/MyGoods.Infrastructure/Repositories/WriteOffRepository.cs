using Microsoft.EntityFrameworkCore;
using MyGoods.Core.Entities;
using MyGoods.Core.Enums;
using MyGoods.Core.Repositories;
using MyGoods.Infrastructure.Data;

namespace MyGoods.Infrastructure.Repositories;

/// <summary>Репозиторий заявок на списание.</summary>
public class WriteOffRepository(AppDbContext dbContext) : Repository<WriteOff>(dbContext), IWriteOffRepository
{
    public async Task<(List<WriteOff> Items, int Total)> Search(WriteOffStatus? status, WriteOffReason? reason, string? search, int page, int limit)
    {
        var query = Set.AsQueryable();

        if (status.HasValue)
            query = query.Where(w => w.Status == status.Value);

        if (reason.HasValue)
            query = query.Where(w => w.Reason == reason.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var text = search.Trim();
            var pattern = $"%{text}%";

            if (int.TryParse(text, out var number))
                query = query.Where(w => w.Number == number || EF.Functions.ILike(w.Product!.Name, pattern) || EF.Functions.ILike(w.Product!.Sku, pattern));
            else
                query = query.Where(w => EF.Functions.ILike(w.Product!.Name, pattern) || EF.Functions.ILike(w.Product!.Sku, pattern));
        }

        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(w => w.CreatedAt)
            .ThenByDescending(w => w.Number)
            .Skip((page - 1) * limit)
            .Take(limit)
            .Include(w => w.Product)
            .AsNoTracking()
            .ToListAsync();

        return (items, total);
    }

    public override async Task<WriteOff?> Read(Guid id) =>
        await Set.Include(w => w.Product).FirstOrDefaultAsync(w => w.Id == id);
}