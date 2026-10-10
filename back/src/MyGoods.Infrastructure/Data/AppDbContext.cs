using Microsoft.EntityFrameworkCore;

namespace MyGoods.Infrastructure.Data;

/// <summary>
/// Контекст базы данных MyGoods (PostgreSQL).
/// Здесь регистрируются таблицы и настраиваются связи между сущностями.
/// </summary>
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    /// <summary>
    /// Настройка модели: ключи, обязательные поля, связи.
    /// </summary>
    /// <param name="modelBuilder">Построитель модели EF Core</param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
    }
}
