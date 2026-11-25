using MyGoods.Application.Exceptions;
using MyGoods.Application.Helpers;
using MyGoods.Core.Entities;
using MyGoods.Core.Enums;
using MyGoods.Core.Repositories;
using MyGoods.Dto;
using MyGoods.Dto.Services;
using MyGoods.Dto.WriteOffs;

namespace MyGoods.Application.Services;

/// <summary>Сервис заявок на списание.</summary>
public class WriteOffService(
    IWriteOffRepository writeOffRepository,
    IProductRepository productRepository) : IWriteOffService
{
    public async Task<PagedResult<WriteOffDto>> GetList(WriteOffQueryDto query)
    {
        var status = query.Status == null ? null : Enum.Parse<WriteOffStatus>(query.Status);
        var reason = query.Reason == null ? null : Enum.Parse<WriteOffReason>(query.Reason);

        var (items, total) = await writeOffRepository.Search(status, reason, query.Search, query.Page, query.Limit);
        var totalPages = (int)Math.Ceiling(total / (double)query.Limit);

        return new PagedResult<WriteOffDto>(
            items.Select(MapperHelper.ToDto).ToList(),
            new PageMeta(query.Page, query.Limit, total, totalPages));
    }

    public async Task<WriteOffDto> GetById(Guid id)
    {
        var writeOff = await writeOffRepository.Read(id)
            ?? throw new NotFoundException($"Заявка на списание с id {id} не найдена.");
        return MapperHelper.ToDto(writeOff);
    }

    public async Task<WriteOffDto> Create(WriteOffCreateDto dto)
    {
        var reason = Enum.Parse<WriteOffReason>(dto.Reason);

        // Проверка обязательного комментария для причины "Другое"
        if (reason == WriteOffReason.Other && string.IsNullOrWhiteSpace(dto.Comment))
            throw new ValidationException("Для причины «Другое» комментарий обязателен.");

        var product = await productRepository.Read(dto.ProductId!.Value)
            ?? throw new ValidationException("Товар не найден.");

        // Проверка: нельзя списать больше, чем доступно (за вычетом резерва)
        if (product.RemainingProduct == null || product.RemainingProduct.Available < dto.Quantity)
            throw new ConflictException($"Недостаточно товара «{product.Name}» для списания. Доступно: {product.RemainingProduct?.Available ?? 0}.");

        var writeOff = new WriteOff
        {
            Id = Guid.NewGuid(),
            ProductId = product.Id,
            Quantity = dto.Quantity,
            Reason = reason,
            Comment = string.IsNullOrWhiteSpace(dto.Comment) ? null : dto.Comment.Trim(),
            Status = WriteOffStatus.Pending,
            CreatedBy = dto.CreatedBy.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        await writeOffRepository.Create(writeOff);
        
        // Чтобы вернуть DTO с названием товара, привязываем его в памяти
        writeOff.Product = product; 

        return MapperHelper.ToDto(writeOff);
    }
}