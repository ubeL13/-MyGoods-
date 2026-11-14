using MyGoods.Application.Exceptions;
using MyGoods.Application.Helpers;
using MyGoods.Core.Entities;
using MyGoods.Core.Enums;
using MyGoods.Core.Repositories;
using MyGoods.Dto.Services;
using MyGoods.Dto.Supplies;

namespace MyGoods.Application.Services;

/// <summary>
/// Сервис поставок: проверяет бизнес-правила, оформляет поставку и принимает товар на склад.
/// </summary>
/// <param name="supplyRepository">Репозиторий поставок</param>
/// <param name="supplierRepository">Репозиторий поставщиков</param>
/// <param name="productRepository">Репозиторий товаров</param>
public class SupplyService(
    ISupplyRepository supplyRepository,
    IRepository<Supplier> supplierRepository,
    IProductRepository productRepository) : ISupplyService
{
    /// <inheritdoc />
    public async Task<SupplyDto> GetById(Guid id) =>
        MapperHelper.ToDto(await GetSupply(id));

    /// <inheritdoc />
    public async Task<SupplyDto> Create(SupplyCreateDto dto)
    {
        var productIds = dto.Items.Select(i => i.ProductId!.Value).ToList();
        if (productIds.Distinct().Count() != productIds.Count)
            throw new ValidationException("Один и тот же товар указан несколько раз — укажите общее количество в одной строке.");

        var supplier = await supplierRepository.Read(dto.SupplierId!.Value)
            ?? throw new ValidationException($"Поставщик с id {dto.SupplierId} не существует.");

        if (!supplier.IsActive)
            throw new ValidationException($"Поставщик «{supplier.Name}» в архиве — у него нельзя оформить поставку.");

        var supply = new Supply
        {
            SupplierId = supplier.Id,
            Supplier = supplier,
            Comment = string.IsNullOrWhiteSpace(dto.Comment) ? null : dto.Comment.Trim(),
            Status = SupplyStatus.Created,
            CreatedAt = DateTime.UtcNow
        };

        foreach (var item in dto.Items)
        {
            // Снятый с продажи товар закупать можно: остатки на складе всё равно нужно учитывать
            var product = await productRepository.Read(item.ProductId!.Value)
                ?? throw new ValidationException($"Товар с id {item.ProductId} не существует.");

            supply.Items.Add(new SupplyItem
            {
                ProductId = product.Id,
                Product = product,
                Quantity = item.Quantity,
                PurchasePrice = item.PurchasePrice
            });
        }

        supply.RecalculateTotal();

        // Номер поставки выдаёт база при сохранении
        await supplyRepository.Create(supply);
        return MapperHelper.ToDto(supply);
    }

    /// <inheritdoc />
    public async Task<SupplyDto> Receive(Guid id, SupplyReceiveDto dto)
    {
        var supply = await GetSupply(id);
        EnsureCreated(supply, "принять");

        var received = dto.Items.ToDictionary(i => i.ProductId!.Value, i => i.ReceivedQuantity);
        if (received.Count != dto.Items.Count)
            throw new ValidationException("Один и тот же товар указан несколько раз.");

        var unknown = received.Keys.Except(supply.Items.Select(i => i.ProductId)).ToList();
        if (unknown.Count > 0)
            throw new ValidationException($"Товара с id {unknown[0]} нет в поставке №{supply.Number}.");

        foreach (var item in supply.Items)
        {
            if (!received.TryGetValue(item.ProductId, out var quantity))
                throw new ValidationException($"Укажите принятое количество для «{item.Product?.Name}».");

            // Пришло меньше (недовоз, брак) — принимаем фактическое; больше заказанного принять нельзя
            if (quantity > item.Quantity)
                throw new ValidationException(
                    $"«{item.Product?.Name}»: заказано {item.Quantity}, принять больше нельзя (указано {quantity}).");

            item.ReceivedQuantity = quantity;
        }

        supply.ChangeStatus(SupplyStatus.Received);

        // Статус, остатки и принятое количество сохраняются в одной транзакции: либо всё, либо ничего
        if (!await supplyRepository.SaveReceived(supply))
            throw new ConflictException($"Поставка №{supply.Number} уже принята или отменена.");

        return MapperHelper.ToDto(supply);
    }

    /// <inheritdoc />
    public async Task<SupplyDto> Cancel(Guid id)
    {
        var supply = await GetSupply(id);
        EnsureCreated(supply, "отменить");

        supply.ChangeStatus(SupplyStatus.Cancelled);

        if (!await supplyRepository.SaveCancelled(supply))
            throw new ConflictException($"Поставка №{supply.Number} уже принята или отменена.");

        return MapperHelper.ToDto(supply);
    }

    /// <summary>
    /// Находит поставку или бросает NotFoundException.
    /// </summary>
    /// <param name="id">Идентификатор поставки</param>
    private async Task<Supply> GetSupply(Guid id) =>
        await supplyRepository.Read(id)
            ?? throw new NotFoundException($"Поставка с id {id} не найдена.");

    /// <summary>
    /// Принять или отменить можно только оформленную поставку: из «Принята» и «Отменена» переходов нет.
    /// </summary>
    /// <param name="supply">Поставка</param>
    /// <param name="action">Действие для текста ошибки: «принять», «отменить»</param>
    private static void EnsureCreated(Supply supply, string action)
    {
        if (supply.Status != SupplyStatus.Created)
            throw new ConflictException(
                $"Нельзя {action} поставку №{supply.Number}: она уже {StatusName(supply.Status)}.");
    }

    /// <summary>
    /// Название статуса по-русски — для понятных сообщений об ошибках.
    /// </summary>
    private static string StatusName(SupplyStatus status) => status switch
    {
        SupplyStatus.Created => "оформлена",
        SupplyStatus.Received => "принята",
        SupplyStatus.Cancelled => "отменена",
        _ => status.ToString()
    };
}
