using System.ComponentModel.DataAnnotations;

namespace MyGoods.Dto.Orders;

/// <summary>
/// Данные для ручного создания заказа менеджером.
/// Покупатель указывается одним из двух способов: CustomerId (существующий) или NewCustomer (новый).
/// </summary>
public class OrderCreateDto
{
    /// <summary>
    /// Существующий покупатель.
    /// </summary>
    public Guid? CustomerId { get; set; }

    /// <summary>
    /// Новый покупатель — создаётся вместе с заказом.
    /// </summary>
    public NewCustomerDto? NewCustomer { get; set; }

    /// <summary>
    /// Адрес доставки.
    /// </summary>
    [Required(ErrorMessage = "Адрес доставки обязателен.")]
    [MaxLength(500, ErrorMessage = "Адрес не длиннее 500 символов.")]
    public string DeliveryAddress { get; set; } = string.Empty;

    /// <summary>
    /// Позиции заказа: товары и количество.
    /// </summary>
    [Required(ErrorMessage = "Добавьте хотя бы один товар.")]
    [MinLength(1, ErrorMessage = "Добавьте хотя бы один товар.")]
    public List<OrderItemCreateDto> Items { get; set; } = [];
}

/// <summary>
/// Новый покупатель, создаваемый вместе с заказом.
/// </summary>
public class NewCustomerDto
{
    /// <summary>
    /// Имя или наименование покупателя.
    /// </summary>
    [Required(ErrorMessage = "Имя покупателя обязательно.")]
    [MaxLength(200, ErrorMessage = "Имя не длиннее 200 символов.")]
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Телефон.
    /// </summary>
    [Required(ErrorMessage = "Телефон покупателя обязателен.")]
    [MaxLength(20, ErrorMessage = "Телефон не длиннее 20 символов.")]
    public string Phone { get; set; } = string.Empty;

    /// <summary>
    /// Электронная почта.
    /// </summary>
    [MaxLength(150, ErrorMessage = "Email не длиннее 150 символов.")]
    [EmailAddress(ErrorMessage = "Неверный формат email.")]
    public string? Email { get; set; }
}

/// <summary>
/// Позиция создаваемого заказа.
/// </summary>
public class OrderItemCreateDto
{
    /// <summary>
    /// Товар.
    /// </summary>
    [Required(ErrorMessage = "Не выбран товар.")]
    public Guid? ProductId { get; set; }

    /// <summary>
    /// Количество (от 1).
    /// </summary>
    [Range(1, 100000, ErrorMessage = "Количество должно быть от 1 до 100000.")]
    public int Quantity { get; set; }
}
