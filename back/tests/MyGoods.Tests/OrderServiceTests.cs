using MyGoods.Application.Exceptions;
using MyGoods.Application.Services;
using MyGoods.Core.Entities;
using MyGoods.Core.Enums;
using MyGoods.Dto.Orders;
using MyGoods.Tests.Fakes;

namespace MyGoods.Tests;

/// <summary>
/// Тесты сервиса заказов: создание заказа, переходы статусов, списание остатков при отправке.
/// Вместо базы данных — заглушки репозиториев со списками в памяти.
/// </summary>
public class OrderServiceTests
{
    private readonly FakeOrderRepository _orders = new();
    private readonly FakeCustomerRepository _customers = new();
    private readonly FakeProductRepository _products = new();
    private readonly OrderService _service;

    private readonly Product _phone;
    private readonly Product _laptop;
    private readonly Product _inactive;
    private readonly Customer _anna;

    /// <summary>
    /// Перед каждым тестом: три товара (один снят с продажи), один покупатель и сервис поверх заглушек.
    /// </summary>
    public OrderServiceTests()
    {
        _phone = NewProduct("PHN-001", "Смартфон", 30000m, quantity: 10);
        _laptop = NewProduct("NB-001", "Ноутбук", 50000m, quantity: 2);
        _inactive = NewProduct("OLD-001", "Снятый товар", 1000m, quantity: 5, isActive: false);
        _products.Products.AddRange([_phone, _laptop, _inactive]);

        _anna = new Customer { Id = Guid.NewGuid(), Name = "Анна", Phone = "79001112233" };
        _customers.Customers.Add(_anna);

        _service = new OrderService(_orders, _customers, _products);
    }

    private static Product NewProduct(string sku, string name, decimal price, int quantity, bool isActive = true) => new()
    {
        Id = Guid.NewGuid(),
        Sku = sku,
        Name = name,
        Price = price,
        IsActive = isActive,
        RemainingProduct = new RemainingProduct { Quantity = quantity, Min = 1 }
    };

    private static OrderItemCreateDto Item(Product product, int quantity) =>
        new() { ProductId = product.Id, Quantity = quantity };

    private OrderCreateDto ForAnna(params OrderItemCreateDto[] items) =>
        new() { CustomerId = _anna.Id, DeliveryAddress = "Самара", Items = [.. items] };

    // ---------- Создание заказа ----------

    /// <summary>
    /// Заказ создаётся в статусе «Новый», цена фиксируется, сумма считается.
    /// </summary>
    [Fact]
    public async Task Create_ExistingCustomer_NewOrderWithTotal()
    {
        var order = await _service.Create(ForAnna(Item(_phone, 2), Item(_laptop, 1)));

        Assert.Equal("New", order.Status);
        Assert.Equal(1, order.Number);
        Assert.Equal(2 * 30000m + 50000m, order.TotalAmount);
        Assert.Equal(2, order.Items.Count);
    }

    /// <summary>
    /// Цена в позиции фиксируется: изменение цены товара после заказа не меняет заказ.
    /// </summary>
    [Fact]
    public async Task Create_PriceIsFixedAtOrderTime()
    {
        var created = await _service.Create(ForAnna(Item(_phone, 1)));

        _phone.Price = 99999m;

        var order = _orders.Orders.Single(o => o.Id == created.Id);
        Assert.Equal(30000m, order.Items.Single().PriceAtOrder);
        Assert.Equal(30000m, order.TotalAmount);
    }

    /// <summary>
    /// Новый покупатель создаётся вместе с заказом, телефон приводится к виду 79991234567.
    /// </summary>
    [Fact]
    public async Task Create_NewCustomer_PhoneNormalized()
    {
        var dto = new OrderCreateDto
        {
            NewCustomer = new NewCustomerDto { Name = "Борис", Phone = "8 (912) 345-67-89" },
            DeliveryAddress = "Самара, ул. Ленина, 1",
            Items = [Item(_phone, 1)]
        };

        var order = await _service.Create(dto);

        Assert.Equal("79123456789", order.CustomerPhone);
        Assert.Equal("Борис", order.CustomerName);
    }

    /// <summary>
    /// Новый покупатель с уже занятым телефоном (в другом формате) — ConflictException.
    /// </summary>
    [Fact]
    public async Task Create_NewCustomerWithExistingPhone_ThrowsConflict()
    {
        var dto = new OrderCreateDto
        {
            NewCustomer = new NewCustomerDto { Name = "Дубль", Phone = "+7 900 111-22-33" },
            DeliveryAddress = "Самара",
            Items = [Item(_phone, 1)]
        };

        await Assert.ThrowsAsync<ConflictException>(() => _service.Create(dto));
        Assert.Empty(_orders.Orders);
    }

    /// <summary>
    /// Покупатель должен быть указан ровно одним способом.
    /// </summary>
    [Fact]
    public async Task Create_BothOrNoCustomer_ThrowsValidation()
    {
        var both = ForAnna(Item(_phone, 1));
        both.NewCustomer = new NewCustomerDto { Name = "X", Phone = "89000000000" };
        var none = ForAnna(Item(_phone, 1));
        none.CustomerId = null;

        await Assert.ThrowsAsync<ValidationException>(() => _service.Create(both));
        await Assert.ThrowsAsync<ValidationException>(() => _service.Create(none));
    }

    /// <summary>
    /// Товар, снятый с продажи, нельзя добавить в заказ.
    /// </summary>
    [Fact]
    public async Task Create_InactiveProduct_ThrowsValidation()
    {
        await Assert.ThrowsAsync<ValidationException>(() => _service.Create(ForAnna(Item(_inactive, 1))));
    }

    /// <summary>
    /// Один товар нельзя указать двумя строками.
    /// </summary>
    [Fact]
    public async Task Create_DuplicateProduct_ThrowsValidation()
    {
        await Assert.ThrowsAsync<ValidationException>(() => _service.Create(ForAnna(Item(_phone, 1), Item(_phone, 2))));
    }

    // ---------- Переходы статусов ----------

    private static OrderStatusChangeDto To(string status) => new() { Status = status };

    /// <summary>
    /// Разрешённый путь: Новый → Подтверждён → Собран → Отправлен.
    /// </summary>
    [Fact]
    public async Task ChangeStatus_FullPath_Succeeds()
    {
        var order = await _service.Create(ForAnna(Item(_phone, 1)));

        Assert.Equal("Confirmed", (await _service.ChangeStatus(order.Id, To("Confirmed"))).Status);
        Assert.Equal("Assembled", (await _service.ChangeStatus(order.Id, To("Assembled"))).Status);
        Assert.Equal("Shipped", (await _service.ChangeStatus(order.Id, To("Shipped"))).Status);
    }

    /// <summary>
    /// Запрещённые переходы: перескок, назад, тот же статус — ConflictException.
    /// </summary>
    [Theory]
    [InlineData("Shipped")]
    [InlineData("Assembled")]
    [InlineData("New")]
    public async Task ChangeStatus_FromNew_OnlyConfirmedAllowed(string target)
    {
        var order = await _service.Create(ForAnna(Item(_phone, 1)));

        await Assert.ThrowsAsync<ConflictException>(() => _service.ChangeStatus(order.Id, To(target)));
        Assert.Equal(OrderStatus.New, _orders.Orders.Single().Status);
    }

    /// <summary>
    /// Смена статуса несуществующего заказа — NotFoundException.
    /// </summary>
    [Fact]
    public async Task ChangeStatus_UnknownOrder_ThrowsNotFound()
    {
        await Assert.ThrowsAsync<NotFoundException>(() => _service.ChangeStatus(Guid.NewGuid(), To("Confirmed")));
    }

    // ---------- Списание остатков ----------

    private async Task<Guid> CreateAssembled(params OrderItemCreateDto[] items)
    {
        var order = await _service.Create(ForAnna(items));
        await _service.ChangeStatus(order.Id, To("Confirmed"));
        await _service.ChangeStatus(order.Id, To("Assembled"));
        return order.Id;
    }

    /// <summary>
    /// При создании заказа товар резервируется: на складе столько же, доступно меньше.
    /// </summary>
    [Fact]
    public async Task Create_ReservesStock()
    {
        await _service.Create(ForAnna(Item(_phone, 3)));

        Assert.Equal(10, _phone.RemainingProduct!.Quantity);
        Assert.Equal(3, _phone.RemainingProduct.Reserved);
        Assert.Equal(7, _phone.RemainingProduct.Available);
    }

    /// <summary>
    /// Сценарий с ветровками: 2 шт. на складе, первый заказ забрал обе — второй заказ создать нельзя.
    /// Ничего не резервируется и заказ не сохраняется.
    /// </summary>
    [Fact]
    public async Task Create_AlreadyReservedInAnotherOrder_ThrowsConflict()
    {
        await _service.Create(ForAnna(Item(_laptop, 2)));

        var error = await Assert.ThrowsAsync<ConflictException>(() =>
            _service.Create(ForAnna(Item(_laptop, 1), Item(_phone, 1))));

        Assert.Contains("уже в других заказах", error.Message);
        Assert.Single(_orders.Orders);
        Assert.Equal(2, _laptop.RemainingProduct!.Reserved);
        Assert.Equal(0, _phone.RemainingProduct!.Reserved);
    }

    /// <summary>
    /// Подтверждение и сборка не меняют ни количество на складе, ни резерв.
    /// </summary>
    [Fact]
    public async Task ConfirmAndAssemble_DoNotChangeStock()
    {
        await CreateAssembled(Item(_phone, 3));

        Assert.Equal(10, _phone.RemainingProduct!.Quantity);
        Assert.Equal(3, _phone.RemainingProduct.Reserved);
    }

    /// <summary>
    /// При отправке товар уходит со склада и снимается резерв.
    /// </summary>
    [Fact]
    public async Task Ship_WritesOffStockAndReleasesReservation()
    {
        var id = await CreateAssembled(Item(_phone, 3), Item(_laptop, 2));

        await _service.ChangeStatus(id, To("Shipped"));

        Assert.Equal(7, _phone.RemainingProduct!.Quantity);
        Assert.Equal(0, _phone.RemainingProduct.Reserved);
        Assert.Equal(0, _laptop.RemainingProduct!.Quantity);
        Assert.Equal(0, _laptop.RemainingProduct.Reserved);
    }
}
