using MyGoods.Core.Entities;
using MyGoods.Dto.Customers;
using MyGoods.Dto.Orders;
using MyGoods.Dto.Products;

namespace MyGoods.Application.Helpers;

/// <summary>
/// Ручное преобразование сущностей в DTO.
/// </summary>
public static class MapperHelper
{
    /// <summary>
    /// Товар → ProductDto.
    /// </summary>
    public static ProductDto ToDto(Product product) =>
        new(
            product.Id,
            product.CategoryId,
            product.Category?.Name,
            product.Sku,
            product.Name,
            product.Price,
            product.Description,
            product.Manufacturer,
            product.IsActive,
            product.CreatedAt,
            product.UpdatedAt,
            product.RemainingProduct == null ? null : ToDto(product.RemainingProduct));

    /// <summary>
    /// Остаток → StockDto.
    /// </summary>
    public static StockDto ToDto(RemainingProduct stock) =>
        new(stock.Quantity, stock.Min, stock.Status.ToString(), stock.Reserved, stock.Available);
    
    /// <summary>
    /// Покупатель → CustomerDto.
    /// </summary>
    public static CustomerDto ToDto(Customer customer) =>
        new(customer.Id, customer.Name, customer.Phone, customer.Email, customer.Address, customer.CreatedAt);

    /// <summary>
    /// Заказ → OrderListItemDto (строка списка заказов).
    /// </summary>
    public static OrderListItemDto ToListItemDto(Order order) =>
        new(
            order.Id,
            order.Number,
            order.Customer?.Name,
            order.Customer?.Phone,
            order.Status.ToString(),
            order.TotalAmount,
            order.Items.Count,
            order.CreatedAt);

    /// <summary>
    /// Заказ → OrderDto.
    /// </summary>
    public static OrderDto ToDto(Order order) =>
        new(
            order.Id,
            order.Number,
            order.CustomerId,
            order.Customer?.Name,
            order.Customer?.Phone,
            order.Status.ToString(),
            order.DeliveryAddress,
            order.TotalAmount,
            order.CreatedAt,
            order.UpdatedAt,
            order.Items.Select(ToDto).ToList());

    /// <summary>
    /// Позиция заказа → OrderItemDto.
    /// </summary>
    public static OrderItemDto ToDto(OrderItem item) =>
        new(
            item.ProductId,
            item.Product?.Sku,
            item.Product?.Name,
            item.Quantity,
            item.PriceAtOrder,
            item.PriceAtOrder * item.Quantity);
}
