using Microsoft.EntityFrameworkCore;
using MyGoods.Core.Entities;

namespace MyGoods.Infrastructure.Data;

/// <summary>
/// Класс-сидер для начального заполнения базы покупателями.
/// </summary>
public static class CustomerDataSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Customers.AnyAsync())
        {
            return;
        }

        var now = DateTime.UtcNow;

        var customers = new[]
        {
            new Customer
            {
                Id = Guid.NewGuid(),
                Name = "Анна Орлова",
                Phone = "79001112233",
                Email = "anna@mail.ru",
                Address = "г. Самара, ул. Ленина, д. 10, кв. 5",
                CreatedAt = now,
                UpdatedAt = now
            },
            new Customer
            {
                Id = Guid.NewGuid(),
                Name = "Иван Петров",
                Phone = "79102223344",
                Email = "ivan.petrov@example.com",
                Address = "г. Москва, ул. Тверская, д. 15",
                CreatedAt = now,
                UpdatedAt = now
            },
            new Customer
            {
                Id = Guid.NewGuid(),
                Name = "Мария Сидорова",
                Phone = "79203334455",
                Email = "m.sidorova@example.com",
                Address = "г. Санкт-Петербург, Невский пр., д. 50",
                CreatedAt = now,
                UpdatedAt = now
            }
        };

        db.Customers.AddRange(customers);
        await db.SaveChangesAsync();
    }
}