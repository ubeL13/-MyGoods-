using System.ComponentModel.DataAnnotations;

namespace MyGoods.Dto.Supplies;

/// <summary>
/// Приёмка поставки: сколько фактически пришло по каждой позиции.
/// </summary>
public class SupplyReceiveDto
{
    /// <summary>
    /// Фактическое количество по каждой позиции поставки (нужно указать все позиции).
    /// </summary>
    [Required(ErrorMessage = "Укажите принятое количество по позициям.")]
    [MinLength(1, ErrorMessage = "Укажите принятое количество по позициям.")]
    public List<SupplyReceiveItemDto> Items { get; set; } = [];
}

/// <summary>
/// Принятое количество по одной позиции.
/// </summary>
public class SupplyReceiveItemDto
{
    /// <summary>
    /// Товар позиции.
    /// </summary>
    [Required(ErrorMessage = "Не указан товар.")]
    public Guid? ProductId { get; set; }

    /// <summary>
    /// Сколько принято: от 0 до заказанного количества.
    /// </summary>
    [Range(0, 100000, ErrorMessage = "Принятое количество не может быть отрицательным.")]
    public int ReceivedQuantity { get; set; }
}
