using Microsoft.EntityFrameworkCore;
using MyGoods.Core.Entities;

namespace MyGoods.Infrastructure.Data;

/// <summary>
/// Класс-сидер для начального заполнения базы поставщиками.
/// </summary>
public static class SupplierDataSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Suppliers.AnyAsync())
        {
            return;
        }

        var now = DateTime.UtcNow;

        var suppliers = new[]
        {
            new Supplier
            {
                Id = Guid.NewGuid(),
                Name = "ООО Ромашка",
                Phone = "79001112233",
                ContactPerson = "Иван Петров",
                Email = "info@romashka.ru",
                Address = "г. Москва, ул. Ленина, д. 1",
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new Supplier
            {
                Id = Guid.NewGuid(),
                Name = "ИП Васильев",
                Phone = "79102223344",
                ContactPerson = "Алексей Васильев",
                Email = "vasiliev@mail.ru",
                Address = "г. Самара, ул. Мира, д. 10",
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new Supplier
            {
                Id = Guid.NewGuid(),
                Name = "ООО ТехноСнаб",
                Phone = "79203334455",
                ContactPerson = "Мария Смирнова",
                Email = "sales@technosnab.ru",
                Address = "г. Санкт-Петербург, Невский пр., д. 50",
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now
            },
            new Supplier
            {
                Id = Guid.NewGuid(),
                Name = "ООО Архивный",
                Phone = "79304445566",
                ContactPerson = "Сергей Иванов",
                Address = "г. Казань",
                IsActive = false, // <-- Архивный поставщик
                CreatedAt = now,
                UpdatedAt = now
            }
        };

        db.Suppliers.AddRange(suppliers);
        await db.SaveChangesAsync();
    }
}
