using Microsoft.EntityFrameworkCore;
using MyGoods.Core.Entities;
using MyGoods.Core.Enums;

namespace MyGoods.Infrastructure.Data;

/// <summary>
/// Класс-сидер для начального заполнения базы поставками.
/// </summary>
public static class SupplyDataSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Supplies.AnyAsync())
        {
            return;
        }

        var suppliers = await db.Suppliers.OrderBy(s => s.Name).ToListAsync();
        var products = await db.Products.Include(p => p.RemainingProduct).OrderBy(p => p.Sku).ToListAsync();

        if (suppliers.Count < 4 || products.Count < 6)
        {
            return; // Ждем, пока отработают другие сидеры
        }

        var now = DateTime.UtcNow;

        // Ищем поставщиков строго по имени, чтобы не зависеть от сортировки
        var romashka = suppliers.First(s => s.Name == "ООО Ромашка");
        var vasiliev = suppliers.First(s => s.Name == "ИП Васильев");
        var technosnab = suppliers.First(s => s.Name == "ООО ТехноСнаб");

        var pPhone = products.First(p => p.Sku == "PHN-001");
        var pLaptop = products.First(p => p.Sku == "NB-001");
        var pTshirt = products.First(p => p.Sku == "TSH-001");
        var pJacket = products.First(p => p.Sku == "JKT-001");

        // 1. Оформлена (Created) - ждем товар
        var s1 = new Supply
        {
            Id = Guid.NewGuid(),
            SupplierId = romashka.Id,
            Status = SupplyStatus.Created,
            ExpectedDate = DateOnly.FromDateTime(now.AddDays(5)),
            Comment = "Ожидаем поступление",
            CreatedAt = now.AddDays(-2),
            Items = new List<SupplyItem>
            {
                new() { Id = Guid.NewGuid(), ProductId = pPhone.Id, Quantity = 5, PurchasePrice = pPhone.Price * 0.8m },
                new() { Id = Guid.NewGuid(), ProductId = pTshirt.Id, Quantity = 10, PurchasePrice = pTshirt.Price * 0.6m }
            }
        };
        s1.RecalculateTotal();

        // 2. Оформлена (Created) - ждем товар
        var s2 = new Supply
        {
            Id = Guid.NewGuid(),
            SupplierId = vasiliev.Id,
            Status = SupplyStatus.Created,
            CreatedAt = now.AddDays(-1),
            Items = new List<SupplyItem>
            {
                new() { Id = Guid.NewGuid(), ProductId = pLaptop.Id, Quantity = 2, PurchasePrice = pLaptop.Price * 0.85m }
            }
        };
        s2.RecalculateTotal();

        // 3. Принята (Received) - остатки уже выросли
        var s3 = new Supply
        {
            Id = Guid.NewGuid(),
            SupplierId = technosnab.Id,
            Status = SupplyStatus.Created, // Временно, изменим через ChangeStatus
            CreatedAt = now.AddDays(-10),
            Items = new List<SupplyItem>
            {
                new() { Id = Guid.NewGuid(), ProductId = pJacket.Id, Quantity = 10, ReceivedQuantity = 10, PurchasePrice = pJacket.Price * 0.7m }
            }
        };
        s3.RecalculateTotal();
        s3.ChangeStatus(SupplyStatus.Received);
        s3.CreatedAt = now.AddDays(-10); // Возвращаем правильную дату создания
        s3.ReceivedAt = now.AddDays(-9); // Ставим реалистичную дату приемки
        s3.UpdatedAt = s3.ReceivedAt;

        // Увеличиваем остаток курток на складе
        pJacket.RemainingProduct!.Quantity += 10;

        // 4. Принята (Received) - остатки уже выросли
        var s4 = new Supply
        {
            Id = Guid.NewGuid(),
            SupplierId = romashka.Id,
            Status = SupplyStatus.Created,
            CreatedAt = now.AddDays(-5),
            Items = new List<SupplyItem>
            {
                new() { Id = Guid.NewGuid(), ProductId = pPhone.Id, Quantity = 3, ReceivedQuantity = 3, PurchasePrice = pPhone.Price * 0.8m }
            }
        };
        s4.RecalculateTotal();
        s4.ChangeStatus(SupplyStatus.Received);
        s4.CreatedAt = now.AddDays(-5);
        s4.ReceivedAt = now.AddDays(-4);
        s4.UpdatedAt = s4.ReceivedAt;

        // Увеличиваем остаток смартфонов на складе
        pPhone.RemainingProduct!.Quantity += 3;

        // 5. Отменена (Cancelled) - остатки не менялись
        var s5 = new Supply
        {
            Id = Guid.NewGuid(),
            SupplierId = vasiliev.Id,
            Status = SupplyStatus.Cancelled,
            Comment = "Отменено поставщиком из-за отсутствия на складе",
            CreatedAt = now.AddDays(-8),
            Items = new List<SupplyItem>
            {
                new() { Id = Guid.NewGuid(), ProductId = pTshirt.Id, Quantity = 5, PurchasePrice = pTshirt.Price * 0.6m }
            }
        };
        s5.RecalculateTotal();
        s5.ChangeStatus(SupplyStatus.Cancelled);
        s5.CreatedAt = now.AddDays(-8);

        // Сохраняем по одной в хронологическом порядке (от самой старой к новой),
        // чтобы номера поставок шли по порядку: 1, 2, 3, 4, 5
        var suppliesInOrder = new[] { s3, s5, s4, s1, s2 };
        foreach (var supply in suppliesInOrder)
        {
            db.Supplies.Add(supply);
            await db.SaveChangesAsync();
        }
    }
}
