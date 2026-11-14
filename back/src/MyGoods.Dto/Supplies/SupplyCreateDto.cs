using System.ComponentModel.DataAnnotations;

namespace MyGoods.Dto.Supplies;

/// <summary>
/// Данные для оформления поставки у поставщика.
/// </summary>
public class SupplyCreateDto
{
    /// <summary>
    /// Поставщик (должен быть активным).
    /// </summary>
    [Required(ErrorMessage = "Не выбран поставщик.")]
    public Guid? SupplierId { get; set; }

    /// <summary>
    /// Комментарий к поставке.
    /// </summary>
    [MaxLength(500, ErrorMessage = "Комментарий не длиннее 500 символов.")]
    public string? Comment { get; set; }

    /// <summary>
    /// Позиции поставки: товар, количество, закупочная цена.
    /// </summary>
    [Required(ErrorMessage = "Добавьте хотя бы один товар.")]
    [MinLength(1, ErrorMessage = "Добавьте хотя бы один товар.")]
    public List<SupplyItemCreateDto> Items { get; set; } = [];
}

/// <summary>
/// Позиция оформляемой поставки.
/// </summary>
public class SupplyItemCreateDto
{
    /// <summary>
    /// Товар.
    /// </summary>
    [Required(ErrorMessage = "Не выбран товар.")]
    public Guid? ProductId { get; set; }

    /// <summary>
    /// Заказываемое количество (от 1).
    /// </summary>
    [Range(1, 100000, ErrorMessage = "Количество должно быть от 1 до 100000.")]
    public int Quantity { get; set; }

    /// <summary>
    /// Закупочная цена за единицу.
    /// </summary>
    [Range(0.01, 9999999999.99, ErrorMessage = "Закупочная цена должна быть больше 0.")]
    public decimal PurchasePrice { get; set; }
}
