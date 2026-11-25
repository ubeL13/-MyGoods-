using MyGoods.Core.Entities;
using MyGoods.Core.Enums;
using MyGoods.Dto.Customers;
using MyGoods.Dto.Orders;
using MyGoods.Dto.Products;
using MyGoods.Dto.Supplies;
using MyGoods.Dto.Suppliers;

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

    /// <summary>
    /// Поставка → SupplyDto. Сумма принятого считается, только когда поставка принята.
    /// </summary>
    public static SupplyDto ToDto(Supply supply) =>
        new(
            supply.Id,
            supply.Number,
            supply.Status.ToString(),
            supply.SupplierId,
            supply.Supplier?.Name,
            supply.ExpectedDate,
            supply.Comment,
            supply.TotalAmount,
            supply.Status == SupplyStatus.Received
                ? supply.Items.Sum(i => (i.ReceivedQuantity ?? 0) * i.PurchasePrice)
                : null,
            supply.CreatedAt,
            supply.ReceivedAt,
            supply.Items.Select(ToDto).ToList());

    /// <summary>
    /// Позиция поставки → SupplyItemDto.
    /// </summary>
    public static SupplyItemDto ToDto(SupplyItem item) =>
        new(
            item.ProductId,
            item.Product?.Sku,
            item.Product?.Name,
            item.Quantity,
            item.PurchasePrice,
            item.ReceivedQuantity,
            item.PurchasePrice * item.Quantity);

    /// <summary>
    /// Поставка → строка списка поставок.
    /// </summary>
    public static SupplyListItemDto ToListItemDto(Supply supply) =>
        new(
            supply.Id,
            supply.Number,
            supply.Status.ToString(),
            supply.SupplierId,
            supply.Supplier?.Name,
            supply.ExpectedDate,
            supply.Items.Count,
            supply.TotalAmount,
            supply.CreatedAt,
            supply.ReceivedAt);
    
    /// <summary>
    /// Поставщик → SupplierDto.
    /// </summary>
    public static SupplierDto ToDto(Supplier supplier) =>
        new(
            supplier.Id,
            supplier.Name,
            supplier.Inn,
            supplier.ContactPerson,
            supplier.Phone,
            supplier.Email,
            supplier.Address,
            supplier.IsActive,
            supplier.CreatedAt,
            supplier.UpdatedAt
        );
    
    /// <summary>
    /// Покупатель с заказами → CustomerDetailsDto.
    /// </summary>
    public static CustomerDetailsDto ToDetailsDto(Customer customer)
    {
        // Сортируем заказы: новые сверху
        var orders = customer.Orders
            .OrderByDescending(o => o.CreatedAt)
            .ThenByDescending(o => o.Number)
            .ToList();

        // Считаем сумму только неотменённых заказов
        var activeOrders = orders.Where(o => o.Status != OrderStatus.Cancelled).ToList();

        return new CustomerDetailsDto(
            customer.Id,
            customer.Name,
            customer.Phone,
            customer.Email,
            customer.Address,
            customer.CreatedAt,
            orders.Count,
            activeOrders.Sum(o => o.TotalAmount),
            orders.Select(ToListItemDto).ToList()
        );
    }
    
    /// <summary>
    /// Заявка на списание → WriteOffDto.
    /// </summary>
    public static WriteOffDto ToDto(WriteOff writeOff) =>
        new(
            writeOff.Id,
            writeOff.Number,
            writeOff.ProductId,
            writeOff.Product?.Sku,
            writeOff.Product?.Name,
            writeOff.Quantity,
            writeOff.Reason.ToString(),
            writeOff.Comment,
            writeOff.Status.ToString(),
            writeOff.CreatedBy,
            writeOff.CreatedAt,
            writeOff.ReviewedAt,
            writeOff.RejectionReason
        );
}
