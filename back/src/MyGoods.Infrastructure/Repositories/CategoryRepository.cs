using Microsoft.EntityFrameworkCore;
using MyGoods.Core.Entities;
using MyGoods.Core.Repositories;
using MyGoods.Infrastructure.Data;

namespace MyGoods.Infrastructure.Repositories;

/// <summary>
/// Репозиторий категорий.
/// </summary>
/// <param name="dbContext">Контекст базы данных</param>
public class CategoryRepository(AppDbContext dbContext) : Repository<Category>(dbContext), ICategoryRepository
{
    /// <inheritdoc />
    public async Task<bool> NameExists(string name, Guid? excludeCategoryId = null) =>
        await Set.AnyAsync(c => c.Name.ToLower() == name.ToLower() && c.Id != excludeCategoryId);

    /// <inheritdoc />
    public async Task<bool> HasChildren(Guid id) =>
        await Set.AnyAsync(c => c.ParentId == id);

    /// <inheritdoc />
    public async Task<bool> HasProducts(Guid id) =>
        await DbContext.Products.AnyAsync(p => p.CategoryId == id);
}
