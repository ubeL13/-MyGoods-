using Microsoft.EntityFrameworkCore;
using MyGoods.Core.Entities;
using MyGoods.Core.Enums;
using MyGoods.Core.Repositories;
using MyGoods.Infrastructure.Data;

namespace MyGoods.Infrastructure.Repositories;

/// <summary>
/// Репозиторий заказов.
/// </summary>
/// <param name="dbContext">Контекст базы данных</param>
public class OrderRepository(AppDbContext dbContext) : Repository<Order>(dbContext), IOrderRepository
{
    /// <summary>
    /// Возвращает заказ вместе с покупателем, позициями и товарами позиций (с остатками).
    /// </summary>
    /// <param name="id">Идентификатор заказа</param>
    public override async Task<Order?> Read(Guid id) =>
        await Set
            .Include(o => o.Customer)
            .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p!.RemainingProduct)
            .FirstOrDefaultAsync(o => o.Id == id);

    /// <inheritdoc />
    public async Task<List<Guid>> CreateWithReservation(Order order)
    {
        await using var transaction = await DbContext.Database.BeginTransactionAsync();

        var failed = new List<Guid>();
        foreach (var item in order.Items)
        {
            // Один UPDATE с условием: «зарезервируй, только если доступно не меньше нужного».
            // PostgreSQL блокирует строку остатка на время транзакции — второй заказ
            // на тот же товар подождёт и увидит уже уменьшенное доступное количество.
            var updated = await DbContext.RemainingProducts
                .Where(r => r.ProductId == item.ProductId && r.Quantity - r.Reserved >= item.Quantity)
                .ExecuteUpdateAsync(s => s.SetProperty(r => r.Reserved, r => r.Reserved + item.Quantity));

            if (updated == 0)
                failed.Add(item.ProductId);
        }

        if (failed.Count > 0)
        {
            await transaction.RollbackAsync();

            // Остатки могли измениться другим заказом, пока шёл этот запрос —
            // перечитываем их из базы, чтобы сообщение об ошибке показало актуальные цифры
            foreach (var item in order.Items.Where(i => failed.Contains(i.ProductId)))
                if (item.Product?.RemainingProduct != null)
                    await DbContext.Entry(item.Product.RemainingProduct).ReloadAsync();

            return failed;
        }

        await Set.AddAsync(order);
        await DbContext.SaveChangesAsync();
        await transaction.CommitAsync();
        return failed;
    }

    /// <inheritdoc />
    public async Task<List<Guid>> SaveShipped(Order order)
    {
        await using var transaction = await DbContext.Database.BeginTransactionAsync();

        var failed = new List<Guid>();
        foreach (var item in order.Items)
        {
            // Товар уходит со склада: уменьшаем и количество, и резерв этого заказа
            var updated = await DbContext.RemainingProducts
                .Where(r => r.ProductId == item.ProductId && r.Reserved >= item.Quantity)
                .ExecuteUpdateAsync(s => s
                    .SetProperty(r => r.Quantity, r => r.Quantity - item.Quantity)
                    .SetProperty(r => r.Reserved, r => r.Reserved - item.Quantity));

            if (updated == 0)
                failed.Add(item.ProductId);
        }

        if (failed.Count > 0)
        {
            await transaction.RollbackAsync();
            return failed;
        }

        await DbContext.SaveChangesAsync();
        await transaction.CommitAsync();
        return failed;
    }
    
    /// <inheritdoc />
    public async Task<(List<Order> Items, int Total)> Search(OrderStatus? status, string? search, int page, int limit)
    {
        var query = Set.AsQueryable();

        if (status.HasValue)
            query = query.Where(o => o.Status == status.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var text = search.Trim();
            var pattern = $"%{text}%";
            var digits = new string(text.Where(char.IsDigit).ToArray());

            if (int.TryParse(text, out var number))
                // Число может быть и номером заказа, и частью телефона
                query = query.Where(o => o.Number == number || o.Customer!.Phone.Contains(digits));
            else if (digits.Length > 0)
                query = query.Where(o => EF.Functions.ILike(o.Customer!.Name, pattern) || o.Customer!.Phone.Contains(digits));
            else
                query = query.Where(o => EF.Functions.ILike(o.Customer!.Name, pattern));
        }

        var total = await query.CountAsync();

        var items = await query
            .OrderByDescending(o => o.CreatedAt)
            .ThenByDescending(o => o.Number)
            .Skip((page - 1) * limit)
            .Take(limit)
            .Include(o => o.Customer)
            .Include(o => o.Items)
            .AsNoTracking()
            .ToListAsync();

        return (items, total);
    }
}
