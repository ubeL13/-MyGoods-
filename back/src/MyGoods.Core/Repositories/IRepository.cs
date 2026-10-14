namespace MyGoods.Core.Repositories;

/// <summary>
/// Общий интерфейс репозитория с базовыми операциями CRUD.
/// </summary>
/// <typeparam name="TEntity">Тип сущности</typeparam>
public interface IRepository<TEntity> where TEntity : class
{
    /// <summary>
    /// Добавляет сущность в базу.
    /// </summary>
    /// <param name="entity">Новая сущность</param>
    /// <returns>Сохранённая сущность</returns>
    Task<TEntity> Create(TEntity entity);

    /// <summary>
    /// Возвращает все сущности.
    /// </summary>
    Task<List<TEntity>> Read();

    /// <summary>
    /// Возвращает сущность по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор</param>
    /// <returns>Сущность или null, если не найдена</returns>
    Task<TEntity?> Read(Guid id);

    /// <summary>
    /// Сохраняет изменения сущности.
    /// </summary>
    /// <param name="entity">Изменённая сущность</param>
    Task Update(TEntity entity);

    /// <summary>
    /// Удаляет сущность по идентификатору.
    /// </summary>
    /// <param name="id">Идентификатор</param>
    /// <returns>True — удалена, false — не найдена</returns>
    Task<bool> Delete(Guid id);
}
