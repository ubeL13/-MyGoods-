using Microsoft.EntityFrameworkCore;
using MyGoods.Core.Repositories;
using MyGoods.Infrastructure.Data;

namespace MyGoods.Infrastructure.Repositories;

/// <summary>
/// Общая реализация репозитория через EF Core. Подходит для любой сущности.
/// </summary>
/// <typeparam name="TEntity">Тип сущности</typeparam>
/// <param name="dbContext">Контекст базы данных</param>
public class Repository<TEntity>(AppDbContext dbContext) : IRepository<TEntity> where TEntity : class
{
    /// <summary>
    /// Контекст базы данных.
    /// </summary>
    protected readonly AppDbContext DbContext = dbContext;

    /// <summary>
    /// Таблица сущностей.
    /// </summary>
    protected readonly DbSet<TEntity> Set = dbContext.Set<TEntity>();

    /// <inheritdoc />
    public async Task<TEntity> Create(TEntity entity)
    {
        await Set.AddAsync(entity);
        await DbContext.SaveChangesAsync();
        return entity;
    }

    /// <inheritdoc />
    public virtual async Task<List<TEntity>> Read() =>
        await Set.AsNoTracking().ToListAsync();

    /// <inheritdoc />
    public virtual async Task<TEntity?> Read(Guid id) =>
        await Set.FindAsync(id);

    /// <inheritdoc />
    public async Task Update(TEntity entity)
    {
        // Сущность, загруженная через этот же контекст, уже отслеживается:
        // EF Core сам видит изменённые поля, достаточно сохранить.
        if (DbContext.Entry(entity).State == EntityState.Detached)
            Set.Update(entity);

        await DbContext.SaveChangesAsync();
    }

    /// <inheritdoc />
    public async Task<bool> Delete(Guid id)
    {
        var entity = await Set.FindAsync(id);
        if (entity == null)
            return false;

        Set.Remove(entity);
        await DbContext.SaveChangesAsync();
        return true;
    }
}
