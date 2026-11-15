using MyGoods.Application.Exceptions;
using MyGoods.Application.Services;
using MyGoods.Core.Entities;
using MyGoods.Core.Enums;
using MyGoods.Dto.Supplies;
using MyGoods.Tests.Fakes;

namespace MyGoods.Tests;

/// <summary>
/// Тесты сервиса поставок: оформление, приёмка товара на склад и отмена.
/// Вместо базы данных — заглушки репозиториев со списками в памяти.
/// </summary>
public class SupplyServiceTests
{
    private readonly FakeSupplyRepository _supplies = new();
    private readonly FakeSupplierRepository _suppliers = new();
    private readonly FakeProductRepository _products = new();
    private readonly SupplyService _service;

    private readonly Supplier _supplier;
    private readonly Supplier _archived;
    private readonly Product _shirt;
    private readonly Product _jacket;
    private readonly Product _newProduct;

    /// <summary>
    /// Перед каждым тестом: два поставщика (один в архиве), три товара — у одного нет записи остатка.
    /// </summary>
    public SupplyServiceTests()
    {
        _supplier = new Supplier { Id = Guid.NewGuid(), Name = "ООО «ТекстильПром»", Phone = "79170000000" };
        _archived = new Supplier { Id = Guid.NewGuid(), Name = "Архивный", Phone = "79170000001", IsActive = false };
        _suppliers.Suppliers.AddRange([_supplier, _archived]);

        _shirt = NewProduct("TSH-001", "Футболка", stock: 40);
        _jacket = NewProduct("JKT-002", "Ветровка", stock: 2);
        _newProduct = new Product { Id = Guid.NewGuid(), Sku = "NEW-001", Name = "Новинка", Price = 500, IsActive = true };
        _products.Products.AddRange([_shirt, _jacket, _newProduct]);

        _service = new SupplyService(_supplies, _suppliers, _products);
    }

    private static Product NewProduct(string sku, string name, int stock) => new()
    {
        Id = Guid.NewGuid(),
        Sku = sku,
        Name = name,
        Price = 1000,
        IsActive = true,
        RemainingProduct = new RemainingProduct { Quantity = stock, Min = 1 }
    };

    private static SupplyItemCreateDto Item(Product product, int quantity, decimal price) =>
        new() { ProductId = product.Id, Quantity = quantity, PurchasePrice = price };

    private SupplyCreateDto FromSupplier(params SupplyItemCreateDto[] items) =>
        new() { SupplierId = _supplier.Id, Items = [.. items] };

    private static SupplyReceiveItemDto Received(Product product, int quantity) =>
        new() { ProductId = product.Id, ReceivedQuantity = quantity };

    private static SupplyReceiveDto Receive(params SupplyReceiveItemDto[] items) => new() { Items = [.. items] };

    // ---------- Оформление ----------

    /// <summary>
    /// Поставка оформляется со статусом «Оформлена», номером и суммой; остатки не меняются до приёмки.
    /// </summary>
    [Fact]
    public async Task Create_NewSupplyWithTotal_StockUnchanged()
    {
        var supply = await _service.Create(FromSupplier(Item(_shirt, 40, 450), Item(_jacket, 10, 2100)));

        Assert.Equal("Created", supply.Status);
        Assert.Equal(1, supply.Number);
        Assert.Equal(40 * 450m + 10 * 2100m, supply.TotalAmount);
        Assert.Equal("ООО «ТекстильПром»", supply.SupplierName);
        Assert.Null(supply.ReceivedAmount);
        Assert.Equal(40, _shirt.RemainingProduct!.Quantity);
        Assert.Equal(2, _jacket.RemainingProduct!.Quantity);
    }

    /// <summary>
    /// У архивного поставщика поставку оформить нельзя.
    /// </summary>
    [Fact]
    public async Task Create_ArchivedSupplier_ThrowsValidation()
    {
        var dto = FromSupplier(Item(_shirt, 1, 100));
        dto.SupplierId = _archived.Id;

        await Assert.ThrowsAsync<ValidationException>(() => _service.Create(dto));
        Assert.Empty(_supplies.Supplies);
    }

    /// <summary>
    /// Несуществующий поставщик или товар — ValidationException.
    /// </summary>
    [Fact]
    public async Task Create_UnknownSupplierOrProduct_ThrowsValidation()
    {
        var unknownSupplier = FromSupplier(Item(_shirt, 1, 100));
        unknownSupplier.SupplierId = Guid.NewGuid();
        var unknownProduct = FromSupplier(new SupplyItemCreateDto { ProductId = Guid.NewGuid(), Quantity = 1, PurchasePrice = 1 });

        await Assert.ThrowsAsync<ValidationException>(() => _service.Create(unknownSupplier));
        await Assert.ThrowsAsync<ValidationException>(() => _service.Create(unknownProduct));
    }

    /// <summary>
    /// Один товар нельзя указать двумя строками.
    /// </summary>
    [Fact]
    public async Task Create_DuplicateProduct_ThrowsValidation()
    {
        await Assert.ThrowsAsync<ValidationException>(() =>
            _service.Create(FromSupplier(Item(_shirt, 1, 100), Item(_shirt, 2, 100))));
    }

    /// <summary>
    /// Ожидаемая дата в прошлом запрещена, сегодняшняя — можно.
    /// </summary>
    [Fact]
    public async Task Create_ExpectedDate_PastForbiddenTodayAllowed()
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var past = FromSupplier(Item(_shirt, 1, 100));
        past.ExpectedDate = today.AddDays(-1);
        var now = FromSupplier(Item(_shirt, 1, 100));
        now.ExpectedDate = today;

        await Assert.ThrowsAsync<ValidationException>(() => _service.Create(past));
        Assert.Equal(today, (await _service.Create(now)).ExpectedDate);
    }

    /// <summary>
    /// Товар, снятый с продажи, закупать можно — остатки на складе всё равно учитываются.
    /// </summary>
    [Fact]
    public async Task Create_InactiveProduct_Allowed()
    {
        _jacket.IsActive = false;

        var supply = await _service.Create(FromSupplier(Item(_jacket, 5, 2000)));

        Assert.Equal("Created", supply.Status);
    }

    // ---------- Приёмка ----------

    private async Task<Guid> CreateSupply(params SupplyItemCreateDto[] items) =>
        (await _service.Create(FromSupplier(items))).Id;

    /// <summary>
    /// Приёмка увеличивает остаток на фактически принятое количество, в том числе при недопоставке.
    /// </summary>
    [Fact]
    public async Task Receive_IncreasesStockByReceivedQuantity()
    {
        var id = await CreateSupply(Item(_shirt, 40, 450), Item(_jacket, 10, 2100));

        var supply = await _service.Receive(id, Receive(Received(_shirt, 40), Received(_jacket, 9)));

        Assert.Equal("Received", supply.Status);
        Assert.NotNull(supply.ReceivedAt);
        Assert.Equal(40 * 450m + 9 * 2100m, supply.ReceivedAmount);
        Assert.Equal(80, _shirt.RemainingProduct!.Quantity);
        Assert.Equal(11, _jacket.RemainingProduct!.Quantity);
    }

    /// <summary>
    /// Можно принять 0 — например, товар пришёл бракованным целиком; остаток не меняется.
    /// </summary>
    [Fact]
    public async Task Receive_ZeroQuantity_StockUnchanged()
    {
        var id = await CreateSupply(Item(_jacket, 10, 2100));

        await _service.Receive(id, Receive(Received(_jacket, 0)));

        Assert.Equal(2, _jacket.RemainingProduct!.Quantity);
    }

    /// <summary>
    /// У товара ещё нет записи об остатке — она создаётся с принятым количеством.
    /// </summary>
    [Fact]
    public async Task Receive_ProductWithoutStock_CreatesStock()
    {
        var id = await CreateSupply(Item(_newProduct, 7, 300));

        await _service.Receive(id, Receive(Received(_newProduct, 7)));

        Assert.Equal(7, _newProduct.RemainingProduct!.Quantity);
    }

    /// <summary>
    /// Принять больше заказанного нельзя; остатки не меняются.
    /// </summary>
    [Fact]
    public async Task Receive_MoreThanOrdered_ThrowsValidation()
    {
        var id = await CreateSupply(Item(_shirt, 5, 450));

        await Assert.ThrowsAsync<ValidationException>(() => _service.Receive(id, Receive(Received(_shirt, 6))));
        Assert.Equal(40, _shirt.RemainingProduct!.Quantity);
        Assert.Equal(SupplyStatus.Created, _supplies.Supplies.Single().Status);
    }

    /// <summary>
    /// Нужно указать все позиции поставки и только их.
    /// </summary>
    [Fact]
    public async Task Receive_MissingOrForeignItem_ThrowsValidation()
    {
        var id = await CreateSupply(Item(_shirt, 5, 450), Item(_jacket, 1, 2100));

        await Assert.ThrowsAsync<ValidationException>(() =>
            _service.Receive(id, Receive(Received(_shirt, 5))));
        await Assert.ThrowsAsync<ValidationException>(() =>
            _service.Receive(id, Receive(Received(_shirt, 5), Received(_jacket, 1), Received(_newProduct, 1))));
        Assert.Equal(40, _shirt.RemainingProduct!.Quantity);
    }

    /// <summary>
    /// Повторная приёмка запрещена — товар не должен добавиться на склад дважды.
    /// </summary>
    [Fact]
    public async Task Receive_Twice_ThrowsConflict()
    {
        var id = await CreateSupply(Item(_shirt, 5, 450));
        await _service.Receive(id, Receive(Received(_shirt, 5)));

        await Assert.ThrowsAsync<ConflictException>(() => _service.Receive(id, Receive(Received(_shirt, 5))));
        Assert.Equal(45, _shirt.RemainingProduct!.Quantity);
    }

    /// <summary>
    /// Параллельный запрос успел принять поставку раньше: база ничего не изменила — 409.
    /// </summary>
    [Fact]
    public async Task Receive_AlreadyProcessedInDb_ThrowsConflict()
    {
        var id = await CreateSupply(Item(_shirt, 5, 450));
        _supplies.AlreadyProcessedInDb = true;

        await Assert.ThrowsAsync<ConflictException>(() => _service.Receive(id, Receive(Received(_shirt, 5))));
        Assert.Equal(40, _shirt.RemainingProduct!.Quantity);
    }

    /// <summary>
    /// Несуществующая поставка — NotFoundException.
    /// </summary>
    [Fact]
    public async Task Receive_UnknownSupply_ThrowsNotFound()
    {
        await Assert.ThrowsAsync<NotFoundException>(() =>
            _service.Receive(Guid.NewGuid(), Receive(Received(_shirt, 1))));
    }

    // ---------- Отмена ----------

    /// <summary>
    /// Оформленную поставку можно отменить, остатки не меняются; принять отменённую нельзя.
    /// </summary>
    [Fact]
    public async Task Cancel_Created_ThenReceiveForbidden()
    {
        var id = await CreateSupply(Item(_shirt, 5, 450));

        var supply = await _service.Cancel(id);

        Assert.Equal("Cancelled", supply.Status);
        Assert.Equal(40, _shirt.RemainingProduct!.Quantity);
        await Assert.ThrowsAsync<ConflictException>(() => _service.Receive(id, Receive(Received(_shirt, 5))));
    }

    /// <summary>
    /// Принятую поставку отменить нельзя — товар уже на складе.
    /// </summary>
    [Fact]
    public async Task Cancel_Received_ThrowsConflict()
    {
        var id = await CreateSupply(Item(_shirt, 5, 450));
        await _service.Receive(id, Receive(Received(_shirt, 5)));

        await Assert.ThrowsAsync<ConflictException>(() => _service.Cancel(id));
        Assert.Equal(SupplyStatus.Received, _supplies.Supplies.Single().Status);
    }

    // ---------- Список ----------

    /// <summary>
    /// Список фильтруется по статусу, в строке — число позиций и поставщик.
    /// </summary>
    [Fact]
    public async Task GetList_FilterByStatus()
    {
        var first = await CreateSupply(Item(_shirt, 5, 450), Item(_jacket, 1, 2100));
        await CreateSupply(Item(_shirt, 1, 450));
        await _service.Cancel(first);

        var result = await _service.GetList(new SupplyQueryDto { Status = "Created" });

        var row = Assert.Single(result.Data);
        Assert.Equal(2, row.Number);
        Assert.Equal(1, row.ItemsCount);
        Assert.Equal("ООО «ТекстильПром»", row.SupplierName);
        Assert.Equal(1, result.Meta.Total);
    }
}
