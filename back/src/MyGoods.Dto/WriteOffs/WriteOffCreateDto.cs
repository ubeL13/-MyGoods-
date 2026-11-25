using System.ComponentModel.DataAnnotations;

namespace MyGoods.Dto.WriteOffs;

/// <summary>Данные для создания заявки на списание.</summary>
public class WriteOffCreateDto
{
    /// <summary>Идентификатор товара.</summary>
    [Required(ErrorMessage = "Товар обязателен.")]
    public Guid? ProductId { get; set; }

    /// <summary>Количество для списания.</summary>
    [Range(1, int.MaxValue, ErrorMessage = "Количество должно быть больше 0.")]
    public int Quantity { get; set; }

    /// <summary>Причина списания (Damaged, Lost, Expired, Other).</summary>
    [Required(ErrorMessage = "Причина обязательна.")]
    [AllowedValues("Damaged", "Lost", "Expired", "Other", ErrorMessage = "Недопустимая причина списания.")]
    public string Reason { get; set; } = string.Empty;

    /// <summary>Комментарий (обязателен для причины Other).</summary>
    public string? Comment { get; set; }

    /// <summary>Имя сотрудника, создавшего заявку.</summary>
    [Required(ErrorMessage = "Укажите, кто оформляет заявку.")]
    [MaxLength(200)]
    public string CreatedBy { get; set; } = string.Empty;
}