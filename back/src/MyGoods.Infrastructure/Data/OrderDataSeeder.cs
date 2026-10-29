using Microsoft.EntityFrameworkCore;
using MyGoods.Core.Entities;
using MyGoods.Core.Enums;

namespace MyGoods.Infrastructure.Data;

/// <summary>
/// Класс-сидер для начального заполнения базы заказами в разных статусах.
/// </summary>
public static class OrderDataSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Orders.AnyAsync())
        {
            return;
        }

        var customers = await db.Customers.OrderBy(c => c.Name).ToListAsync();
        var products = await db.Products.Include(p => p.RemainingProduct).OrderBy(p => p.Sku).ToListAsync();

        if (customers.Count == 0 || products.Count < 6)
        {
            return; // ждем, пока отработают другие сидеры
        }

        var now = DateTime.UtcNow;

        // Берем конкретные товары для разных сценариев
        var pPhone = products.First(p => p.Sku == "PHN-001"); // Смартфон
        var pLaptop = products.First(p => p.Sku == "NB-001"); // Ноутбук
        var pTshirt = products.First(p => p.Sku == "TSH-001"); // Футболка
        var pJacket = products.First(p => p.Sku == "JKT-001"); // Куртка
        var pPhone2 = products.First(p => p.Sku == "PHN-002"); // Смартфон 2
        var pPhone3 = products.First(p => p.Sku == "PHN-005"); // Смартфон 3

        // 1. Новый (New)
        var order1 = new Order
        {
            Id = Guid.NewGuid(),
            CustomerId = customers[0].Id,
            DeliveryAddress = customers[0].Address ?? "г. Самара",
            Status = OrderStatus.New,
            CreatedAt = now.AddDays(-1),
            Items = new List<OrderItem>
            {
                new() { Id = Guid.NewGuid(), ProductId = pPhone.Id, Quantity = 1, PriceAtOrder = pPhone.Price }
            }
        };
        order1.RecalculateTotal();

        // 2. Подтвержден (Confirmed)
        var order2 = new Order
        {
            Id = Guid.NewGuid(),
            CustomerId = customers[1].Id,
            DeliveryAddress = customers[1].Address ?? "г. Москва",
            Status = OrderStatus.Confirmed,
            CreatedAt = now.AddDays(-2),
            Items = new List<OrderItem>
            {
                new() { Id = Guid.NewGuid(), ProductId = pLaptop.Id, Quantity = 1, PriceAtOrder = pLaptop.Price }
            }
        };
        order2.RecalculateTotal();

        // 3. Собран (Assembled)
        var order3 = new Order
        {
            Id = Guid.NewGuid(),
            CustomerId = customers[2].Id,
            DeliveryAddress = customers[2].Address ?? "г. СПб",
            Status = OrderStatus.Assembled,
            CreatedAt = now.AddDays(-3),
            Items = new List<OrderItem>
            {
                new() { Id = Guid.NewGuid(), ProductId = pTshirt.Id, Quantity = 2, PriceAtOrder = pTshirt.Price }
            }
        };
        order3.RecalculateTotal();

        // 4. Отправлен (Shipped) - остатки уже списаны
        var order4 = new Order
        {
            Id = Guid.NewGuid(),
            CustomerId = customers[0].Id,
            DeliveryAddress = customers[0].Address ?? "г. Самара",
            Status = OrderStatus.Shipped,
            CreatedAt = now.AddDays(-4),
            Items = new List<OrderItem>
            {
                new() { Id = Guid.NewGuid(), ProductId = pJacket.Id, Quantity = 1, PriceAtOrder = pJacket.Price }
            }
        };
        order4.RecalculateTotal();

        // 5. Доставлен (Delivered)
        var order5 = new Order
        {
            Id = Guid.NewGuid(),
            CustomerId = customers[1].Id,
            DeliveryAddress = customers[1].Address ?? "г. Москва",
            Status = OrderStatus.Delivered,
            CreatedAt = now.AddDays(-5),
            Items = new List<OrderItem>
            {
                new() { Id = Guid.NewGuid(), ProductId = pPhone2.Id, Quantity = 1, PriceAtOrder = pPhone2.Price }
            }
        };
        order5.RecalculateTotal();

        // 6. Отменен (Cancelled) - резерв снят
        var order6 = new Order
        {
            Id = Guid.NewGuid(),
            CustomerId = customers[2].Id,
            DeliveryAddress = customers[2].Address ?? "г. СПб",
            Status = OrderStatus.Cancelled,
            CreatedAt = now.AddDays(-6),
            Items = new List<OrderItem>
            {
                new() { Id = Guid.NewGuid(), ProductId = pPhone3.Id, Quantity = 1, PriceAtOrder = pPhone3.Price }
            }
        };
        order6.RecalculateTotal();
        
        // Неотправленные заказы держат товар в резерве - как при создании заказа через API
        foreach (var item in new[] { order1, order2, order3 }.SelectMany(o => o.Items))
            products.Single(p => p.Id == item.ProductId).RemainingProduct!.Reserved += item.Quantity;
        

        db.Orders.AddRange(order1, order2, order3, order4, order5, order6);
        
        await db.SaveChangesAsync();
    }
}