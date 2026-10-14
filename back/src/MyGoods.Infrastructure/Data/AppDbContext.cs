using Microsoft.EntityFrameworkCore;
using MyGoods.Core.Entities;

namespace MyGoods.Infrastructure.Data;

/// <summary>
/// Контекст базы данных MyGoods (PostgreSQL).
/// Здесь регистрируются таблицы и настраиваются связи между сущностями.
/// </summary>
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    /// <summary>
    /// Категории товаров.
    /// </summary>
    public DbSet<Category> Categories => Set<Category>();

    /// <summary>
    /// Товары.
    /// </summary>
    public DbSet<Product> Products => Set<Product>();

    /// <summary>
    /// Остатки товаров на складе.
    /// </summary>
    public DbSet<RemainingProduct> RemainingProducts => Set<RemainingProduct>();

    /// <summary>
    /// Настройка модели: ключи, обязательные поля, связи.
    /// </summary>
    /// <param name="modelBuilder">Построитель модели EF Core</param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Category>(entity =>
        {
            entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
            entity.Property(c => c.Description).HasMaxLength(500);

            // Нельзя удалить категорию, у которой есть подкатегории
            entity.HasOne(c => c.Parent)
                .WithMany(c => c.Children)
                .HasForeignKey(c => c.ParentId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.Property(p => p.Sku).IsRequired().HasMaxLength(50);
            entity.HasIndex(p => p.Sku).IsUnique();

            entity.Property(p => p.Name).IsRequired().HasMaxLength(200);
            entity.Property(p => p.Price).HasPrecision(12, 2);
            entity.Property(p => p.Description).HasMaxLength(1000);
            entity.Property(p => p.Manufacturer).HasMaxLength(100);

            // Нельзя удалить категорию, в которой есть товары
            entity.HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(p => p.RemainingProduct)
                .WithOne(r => r.Product)
                .HasForeignKey<RemainingProduct>(r => r.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
