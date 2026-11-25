using System.ComponentModel.DataAnnotations;

namespace MyGoods.Dto.WriteOffs;

/// <summary>Параметры списка заявок на списание.</summary>
public class WriteOffQueryDto
{
    /// <summary>Фильтр по статусу (Pending, Approved, Rejected).</summary>
    [AllowedValues(null, "Pending", "Approved", "Rejected")]
    public string? Status { get; set; }

    /// <summary>Фильтр по причине (Damaged, Lost, Expired, Other).</summary>
    [AllowedValues(null, "Damaged", "Lost", "Expired", "Other")]
    public string? Reason { get; set; }

    /// <summary>Поиск по номеру заявки, названию или артикулу товара.</summary>
    [MaxLength(200)]
    public string? Search { get; set; }

    /// <summary>Номер страницы.</summary>
    [Range(1, int.MaxValue)]
    public int Page { get; set; } = 1;

    /// <summary>Записей на странице.</summary>
    [Range(1, 100)]
    public int Limit { get; set; } = 20;
}