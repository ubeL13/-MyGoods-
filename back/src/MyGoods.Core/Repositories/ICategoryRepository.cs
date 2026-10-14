using MyGoods.Core.Entities;

namespace MyGoods.Core.Repositories;

/// <summary>
/// Репозиторий категорий: базовый CRUD и проверки, нужные только категориям.
/// </summary>
public interface ICategoryRepository : IRepository<Category>
{
    /// <summary>
    /// Проверяет, занято ли название другой категорией (без учёта регистра).
    /// </summary>
    /// <param name="name">Название</param>
    /// <param name="excludeCategoryId">Категория, которую не учитывать (при редактировании — сама категория)</param>
    /// <returns>True — название уже занято</returns>
    Task<bool> NameExists(string name, Guid? excludeCategoryId = null);

    /// <summary>
    /// Проверяет, есть ли у категории подкатегории.
    /// </summary>
    /// <param name="id">Идентификатор категории</param>
    Task<bool> HasChildren(Guid id);

    /// <summary>
    /// Проверяет, есть ли в категории товары.
    /// </summary>
    /// <param name="id">Идентификатор категории</param>
    Task<bool> HasProducts(Guid id);
}
