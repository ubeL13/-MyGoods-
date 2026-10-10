namespace MyGoods.Core.Entities;

/// <summary>
/// Категория товаров. Категории образуют дерево: у категории может быть родитель и подкатегории.
/// </summary>
public class Category
{
    /// <summary>
    /// Идентификатор категории.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Название категории.
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Описание категории.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Идентификатор родительской категории. Null — категория верхнего уровня.
    /// </summary>
    public Guid? ParentId { get; set; }

    /// <summary>
    /// Родительская категория.
    /// </summary>
    public Category? Parent { get; set; }

    /// <summary>
    /// Подкатегории.
    /// </summary>
    public List<Category> Children { get; set; } = [];
}
