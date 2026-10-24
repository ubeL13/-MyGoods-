using MyGoods.Application.Exceptions;
using MyGoods.Application.Helpers;
using MyGoods.Core.Entities;
using MyGoods.Core.Enums;
using MyGoods.Core.Repositories;
using MyGoods.Dto.Orders;
using MyGoods.Dto.Services;

namespace MyGoods.Application.Services;

/// <summary>
/// Сервис заказов: проверяет бизнес-правила и сохраняет заказ через репозиторий.
/// </summary>
/// <param name="orderRepository">Репозиторий заказов</param>
/// <param name="customerRepository">Репозиторий покупателей</param>
/// <param name="productRepository">Репозиторий товаров</param>
public class OrderService(
    IOrderRepository orderRepository,
    ICustomerRepository customerRepository,
    IProductRepository productRepository) : IOrderService
{
    /// <inheritdoc />
    public async Task<OrderDto> Create(OrderCreateDto dto)
    {
        var productIds = dto.Items.Select(i => i.ProductId!.Value).ToList();
        if (productIds.Distinct().Count() != productIds.Count)
            throw new ValidationException("Один и тот же товар указан несколько раз — укажите общее количество в одной строке.");

        var customer = await GetOrCreateCustomer(dto);

        var now = DateTime.UtcNow;
        var order = new Order
        {
            CustomerId = customer.Id,
            Customer = customer,
            DeliveryAddress = dto.DeliveryAddress.Trim(),
            Status = OrderStatus.New,
            CreatedAt = now
        };

        foreach (var item in dto.Items)
        {
            var product = await productRepository.Read(item.ProductId!.Value)
                ?? throw new ValidationException($"Товар с id {item.ProductId} не существует.");

            if (!product.IsActive)
                throw new ValidationException($"Товар «{product.Name}» снят с продажи — его нельзя добавить в заказ.");

            order.Items.Add(new OrderItem
            {
                ProductId = product.Id,
                Product = product,
                Quantity = item.Quantity,
                // Цена фиксируется на момент заказа: если цена товара потом изменится, заказ не изменится
                PriceAtOrder = product.Price
            });
        }

        order.RecalculateTotal();

        await orderRepository.Create(order);
        return MapperHelper.ToDto(order);
    }

    /// <summary>
    /// Возвращает существующего покупателя или создаёт нового (он сохранится вместе с заказом).
    /// Должен быть указан ровно один вариант: CustomerId или NewCustomer.
    /// </summary>
    /// <param name="dto">Данные заказа</param>
    private async Task<Customer> GetOrCreateCustomer(OrderCreateDto dto)
    {
        if (dto.CustomerId.HasValue == (dto.NewCustomer != null))
            throw new ValidationException("Укажите либо существующего покупателя, либо данные нового.");

        if (dto.CustomerId.HasValue)
            return await customerRepository.Read(dto.CustomerId.Value)
                ?? throw new ValidationException($"Покупатель с id {dto.CustomerId} не существует.");

        var phone = PhoneHelper.Normalize(dto.NewCustomer!.Phone)
            ?? throw new ValidationException("Неверный формат телефона. Пример: +7 999 123-45-67.");

        if (await customerRepository.PhoneExists(phone))
            throw new ConflictException($"Покупатель с телефоном {phone} уже есть — выберите его из списка.");

        return new Customer
        {
            Name = dto.NewCustomer.Name.Trim(),
            Phone = phone,
            Email = string.IsNullOrWhiteSpace(dto.NewCustomer.Email) ? null : dto.NewCustomer.Email.Trim(),
            // Адрес доставки первого заказа запоминаем как адрес покупателя
            Address = dto.DeliveryAddress.Trim(),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
    }
}
