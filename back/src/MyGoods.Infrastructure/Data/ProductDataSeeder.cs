using Microsoft.EntityFrameworkCore;
using MyGoods.Core.Entities;

namespace MyGoods.Infrastructure.Data;

/// <summary>
/// Класс-сидер для начального заполнения товаров и их остатков.
/// </summary>
public static class ProductDataSeeder
{
    /// <summary>
    /// Асинхронно заполняет базу данных товарами и остатками, если таблица товаров пуста.
    /// </summary>
    /// <param name="db">Контекст базы данных AppDbContext.</param>
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Products.AnyAsync())
        {
            return;
        }

        // Получаем существующие категории, чтобы привязать к ним товары
        var categories = await db.Categories.ToListAsync();
        if (categories.Count == 0)
        {
            return;
        }

        var now = DateTime.UtcNow;
        var products = new List<Product>();
        var remainings = new List<RemainingProduct>();

        // Массив данных для генерации 24 товаров (по 4 на каждую из 6 категорий)
        for (int i = 1; i <= 24; i++)
        {
            var category = categories[(i - 1) % categories.Count];
            var sku = $"SKU-PROD-{i:D3}";
            var name = $"Товар тестовый {i}";
            var price = 100m * i + 99.99m;
            var description = $"Описание для тестового товара номер {i}, относящегося к категории {category.Name}.";
            var manufacturer = i % 2 == 0 ? "BrandA" : "BrandB";

            var product = NewProduct(sku, name, price, description, manufacturer, category.Id, now);
            products.Add(product);

            // Распределение статусов остатков:
            // 1) Нет в наличии (Quantity == 0)
            // 2) Заканчивается (Quantity <= Min)
            // 3) В наличии (Quantity > Min)
            int quantity;
            int min = 5;

            int mod = i % 3;
            if (mod == 0)
            {
                quantity = 0; // Нет в наличии
            }
            else if (mod == 1)
            {
                quantity = 2; // Заканчивается (2 <= 5)
            }
            else
            {
                quantity = 50; // В наличии (50 > 5)
            }

            var remaining = new RemainingProduct
            {
                Id = Guid.NewGuid(),
                ProductId = product.Id,
                Quantity = quantity,
                Min = min
            };
            remainings.Add(remaining);
        }

        db.Products.AddRange(products);
        await db.SaveChangesAsync();

        db.RemainingProducts.AddRange(remainings);
        await db.SaveChangesAsync();
    }

    /// <summary>
    /// Вспомогательный метод для создания экземпляра Product с обязательными полями.
    /// </summary>
    private static Product NewProduct(
        string sku,
        string name,
        decimal price,
        string description,
        string manufacturer,
        Guid categoryId,
        DateTime now)
    {
        return new Product
        {
            Id = Guid.NewGuid(),
            Sku = sku,
            Name = name,
            Price = price,
            Description = description,
            Manufacturer = manufacturer,
            CategoryId = categoryId,
            IsActive = true,
            CreatedAt = now,
            UpdatedAt = now
        };
    }
}