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

        var categories = await db.Categories.ToListAsync();
        if (categories.Count == 0)
        {
            return;
        }

        var byName = categories.ToDictionary(c => c.Name, c => c.Id);
        var now = DateTime.UtcNow;

        var items = new (string Category, string Sku, string Name, string Manufacturer, decimal Price, int Quantity, int Min, bool IsActive)[]
        {
            ("Смартфоны", "PHN-001", "Смартфон Samsung Galaxy A55 128 ГБ", "Samsung", 34990m, 25, 5, true),
            ("Смартфоны", "PHN-002", "Смартфон Apple iPhone 15 128 ГБ", "Apple", 79990m, 3, 5, true),
            ("Смартфоны", "PHN-003", "Смартфон Xiaomi Redmi Note 13", "Xiaomi", 19990m, 0, 5, true),
            ("Смартфоны", "PHN-004", "Смартфон Google Pixel 8", "Google", 59990m, 0, 2, false),
            ("Смартфоны", "PHN-005", "Смартфон Honor 90", "Honor", 32990m, 12, 4, true),
            ("Смартфоны", "PHN-006", "Смартфон Realme 12 Pro", "Realme", 27990m, 4, 4, true),

            ("Ноутбуки", "NB-001", "Ноутбук Lenovo IdeaPad Slim 5", "Lenovo", 64990m, 8, 3, true),
            ("Ноутбуки", "NB-002", "Ноутбук ASUS VivoBook 15", "ASUS", 52990m, 2, 3, true),
            ("Ноутбуки", "NB-003", "Ноутбук Apple MacBook Air 13 M2", "Apple", 109990m, 0, 2, true),
            ("Ноутбуки", "NB-004", "Ноутбук HP Pavilion 15", "HP", 58990m, 15, 3, true),
            ("Ноутбуки", "NB-005", "Ноутбук Acer Aspire 5", "Acer", 47990m, 1, 3, false),
            ("Ноутбуки", "NB-006", "Ноутбук Huawei MateBook D 16", "Huawei", 69990m, 6, 3, true),

            ("Футболки", "TSH-001", "Футболка хлопковая белая", "Befree", 990m, 40, 10, true),
            ("Футболки", "TSH-002", "Футболка оверсайз чёрная", "Gloria Jeans", 1290m, 7, 10, true),
            ("Футболки", "TSH-003", "Футболка с принтом", "O'stin", 1490m, 0, 5, true),
            ("Футболки", "TSH-004", "Футболка поло синяя", "Zarina", 1990m, 18, 5, true),
            ("Футболки", "TSH-005", "Лонгслив серый", "Befree", 1690m, 5, 5, true),
            ("Футболки", "TSH-006", "Майка спортивная", "Demix", 790m, 30, 8, true),

            ("Куртки", "JKT-001", "Пуховик зимний чёрный", "Zolla", 8990m, 9, 3, true),
            ("Куртки", "JKT-002", "Ветровка непромокаемая", "Demix", 4490m, 2, 3, true),
            ("Куртки", "JKT-003", "Куртка джинсовая", "Gloria Jeans", 3990m, 0, 2, true),
            ("Куртки", "JKT-004", "Парка утеплённая", "O'stin", 7490m, 11, 3, true),
            ("Куртки", "JKT-005", "Бомбер оливковый", "Befree", 3490m, 0, 2, false),
            ("Куртки", "JKT-006", "Куртка демисезонная", "Zolla", 5990m, 3, 3, true),
        };

        foreach (var item in items)
        {
            db.Products.Add(new Product
            {
                Id = Guid.NewGuid(),
                CategoryId = byName[item.Category],
                Sku = item.Sku,
                Name = item.Name,
                Manufacturer = item.Manufacturer,
                Price = item.Price,
                Description = $"{item.Name}. Тестовый товар для демонстрации каталога.",
                IsActive = item.IsActive,
                CreatedAt = now,
                UpdatedAt = now,
                RemainingProduct = new RemainingProduct
                {
                    Id = Guid.NewGuid(),
                    Quantity = item.Quantity,
                    Min = item.Min
                }
            });
        }

        await db.SaveChangesAsync();
    }
}