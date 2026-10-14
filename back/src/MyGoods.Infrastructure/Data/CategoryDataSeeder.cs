using Microsoft.EntityFrameworkCore;
using MyGoods.Core.Entities;

namespace MyGoods.Infrastructure.Data;

/// <summary>
/// Класс-сидер для начального заполнения таблицы категорий.
/// </summary>
public static class CategoryDataSeeder
{
    /// <summary>
    /// Асинхронно заполняет базу данных категориями и подкатегориями, если таблица пуста.
    /// </summary>
    /// <param name="db">Контекст базы данных AppDbContext.</param>
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Categories.AnyAsync())
        {
            return;
        }

        // Корневая категория 1: Электроника
        var electronicsId = Guid.NewGuid();
        var electronics = new Category
        {
            Id = electronicsId,
            Name = "Электроника",
            Description = "Устройства, гаджеты и электронная техника",
            ParentId = null
        };

        var smartphones = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Смартфоны",
            Description = "Мобильные телефоны и смартфоны",
            ParentId = electronicsId
        };

        var laptops = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Ноутбуки",
            Description = "Портативные компьютеры и ультрабуки",
            ParentId = electronicsId
        };

        // Корневая категория 2: Одежда
        var clothingId = Guid.NewGuid();
        var clothing = new Category
        {
            Id = clothingId,
            Name = "Одежда",
            Description = "Мужская и женская одежда",
            ParentId = null
        };

        var tshirts = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Футболки",
            Description = "Повседневные футболки и майки",
            ParentId = clothingId
        };

        var jackets = new Category
        {
            Id = Guid.NewGuid(),
            Name = "Куртки",
            Description = "Верхняя демисезонная и зимняя одежда",
            ParentId = clothingId
        };

        db.Categories.AddRange(electronics, smartphones, laptops, clothing, tshirts, jackets);
        await db.SaveChangesAsync();
    }
}