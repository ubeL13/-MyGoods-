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
    /// Покупатели.
    /// </summary>
    public DbSet<Customer> Customers => Set<Customer>();

    /// <summary>
    /// Заказы.
    /// </summary>
    public DbSet<Order> Orders => Set<Order>();

    /// <summary>
    /// Позиции заказов.
    /// </summary>
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    
    /// <summary>
    /// Поставщик товаров.
    /// </summary>
    public DbSet<Supplier> Suppliers => Set<Supplier>();
        
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

        modelBuilder.Entity<RemainingProduct>(entity =>
        {
            // Защита на уровне базы: резерв не бывает отрицательным и не больше, чем лежит на складе
            entity.ToTable(t => t.HasCheckConstraint(
                "CK_RemainingProducts_Reserved",
                "\"Reserved\" >= 0 AND \"Reserved\" <= \"Quantity\""));
        });

        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(c => c.Id);

            entity.Property(c => c.Name).IsRequired().HasMaxLength(200);
            entity.Property(c => c.Phone).IsRequired().HasMaxLength(20);
            entity.Property(c => c.Email).HasMaxLength(150);
            entity.Property(c => c.Address).HasMaxLength(500);

            // Индекс на телефон для быстрого поиска клиента
            entity.HasIndex(c => c.Phone).IsUnique();
            
            // Нельзя удалить клиента, пока в базе есть связанные заказы
            entity.HasMany(c => c.Orders)
                .WithOne(o => o.Customer)
                .HasForeignKey(o => o.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(o => o.Id);

            // Номер заказа генерируется базой автоматически
            entity.Property(o => o.Number).UseIdentityAlwaysColumn();
            entity.HasIndex(o => o.Number).IsUnique();

            entity.Property(o => o.DeliveryAddress).IsRequired().HasMaxLength(500);
            entity.Property(o => o.TotalAmount).HasPrecision(12, 2);

            // Индекс по покупателю и дате
            entity.HasIndex(o => new { o.CustomerId, o.CreatedAt });

            // При удалении заказа удаляются и его позиции
            entity.HasMany(o => o.Items)
                .WithOne(i => i.Order)
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(oi => oi.Id);
            
            entity.Property(oi => oi.PriceAtOrder).HasPrecision(12, 2);

            // Нельзя удалить товар из каталога, если он уже присутствует в оформленных заказах
            entity.HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            // Один и тот же товар не должен встречаться в одном заказе дважды отдельными строками
            entity.HasIndex(oi => new { oi.OrderId, oi.ProductId }).IsUnique();
        });
        
        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.HasKey(s => s.Id);

            entity.Property(s => s.Name)
                .IsRequired()
                .HasMaxLength(200);

            // Уникальный индекс
            entity.HasIndex(s => s.Name)
                .IsUnique();

            entity.Property(s => s.Inn)
                .HasMaxLength(12);

            entity.Property(s => s.ContactPerson)
                .HasMaxLength(200);
            
            entity.Property(s => s.Phone)
                .IsRequired()
                .HasMaxLength(20);

            entity.Property(s => s.Email)
                .HasMaxLength(150);

            entity.Property(s => s.Address)
                .HasMaxLength(500);

            entity.Property(s => s.IsActive)
                .HasDefaultValue(true);
        
            // TODO после 10.01
            // entity.HasMany(s => s.Supplies)
            //     .WithOne(s => s.Supplier)
            //     .HasForeignKey(s => s.SupplierId)
            //     .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
