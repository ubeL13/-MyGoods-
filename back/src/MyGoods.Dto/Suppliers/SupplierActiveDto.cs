namespace MyGoods.Dto.Suppliers;

/// <summary>
/// Данные для изменения активности (архивации) поставщика.
/// </summary>
public class SupplierActiveDto
{
    /// <summary>
    /// Активен ли поставщик.
    /// </summary>
    public bool IsActive { get; set; }
}