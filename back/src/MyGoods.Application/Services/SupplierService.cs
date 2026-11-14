using MyGoods.Application.Exceptions;
using MyGoods.Application.Helpers;
using MyGoods.Core.Entities;
using MyGoods.Core.Repositories;
using MyGoods.Dto;
using MyGoods.Dto.Services;
using MyGoods.Dto.Suppliers;

namespace MyGoods.Application.Services;

/// <summary>
/// Сервис поставщиков.
/// </summary>
/// <param name="supplierRepository">Репозиторий поставщиков</param>
public class SupplierService(ISupplierRepository supplierRepository) : ISupplierService
{
    /// <inheritdoc />
    public async Task<PagedResult<SupplierDto>> GetList(SupplierQueryDto query)
    {
        var (items, total) = await supplierRepository.Search(query.Search, query.Page, query.Limit);

        var totalPages = (int)Math.Ceiling(total / (double)query.Limit);
        return new PagedResult<SupplierDto>(
            items.Select(MapperHelper.ToDto).ToList(),
            new PageMeta(query.Page, query.Limit, total, totalPages));
    }

    /// <inheritdoc />
    public async Task<SupplierDto> GetById(Guid id)
    {
        var supplier = await supplierRepository.Read(id)
            ?? throw new NotFoundException($"Поставщик с id {id} не найден.");

        return MapperHelper.ToDto(supplier);
    }

    /// <inheritdoc />
    public async Task<SupplierDto> Create(SupplierCreateDto dto)
    {
        var name = dto.Name.Trim();
        
        if (await supplierRepository.NameExists(name))
            throw new ConflictException($"Поставщик с названием «{name}» уже существует.");

        var phone = PhoneHelper.Normalize(dto.Phone)
            ?? throw new ValidationException("Неверный формат телефона. Пример: +7 999 123-45-67.");

        var now = DateTime.UtcNow;
        var supplier = new Supplier
        {
            Id = Guid.NewGuid(),
            Name = name,
            Inn = string.IsNullOrWhiteSpace(dto.Inn) ? null : dto.Inn.Trim(),
            ContactPerson = string.IsNullOrWhiteSpace(dto.ContactPerson) ? null : dto.ContactPerson.Trim(),
            Phone = phone,
            Email = string.IsNullOrWhiteSpace(dto.Email) ? null : dto.Email.Trim(),
            Address = string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address.Trim(),
            IsActive = true,
            CreatedAt = now,
            UpdatedAt = now
        };

        await supplierRepository.Create(supplier);
        return MapperHelper.ToDto(supplier);
    }

    /// <inheritdoc />
    public async Task<SupplierDto> Update(Guid id, SupplierEditDto dto)
    {
        var supplier = await supplierRepository.Read(id)
            ?? throw new NotFoundException($"Поставщик с id {id} не найден.");

        var name = dto.Name.Trim();

        if (await supplierRepository.NameExists(name, id))
            throw new ConflictException($"Поставщик с названием «{name}» уже существует.");

        var phone = PhoneHelper.Normalize(dto.Phone)
            ?? throw new ValidationException("Неверный формат телефона. Пример: +7 999 123-45-67.");

        supplier.Name = name;
        supplier.Inn = string.IsNullOrWhiteSpace(dto.Inn) ? null : dto.Inn.Trim();
        supplier.ContactPerson = string.IsNullOrWhiteSpace(dto.ContactPerson) ? null : dto.ContactPerson.Trim();
        supplier.Phone = phone;
        supplier.Email = string.IsNullOrWhiteSpace(dto.Email) ? null : dto.Email.Trim();
        supplier.Address = string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address.Trim();
        supplier.UpdatedAt = DateTime.UtcNow;

        await supplierRepository.Update(supplier);
        return MapperHelper.ToDto(supplier);
    }

    /// <inheritdoc />
    public async Task Archive(Guid id)
    {
        var supplier = await supplierRepository.Read(id)
            ?? throw new NotFoundException($"Поставщик с id {id} не найден.");

        supplier.IsActive = false;
        supplier.UpdatedAt = DateTime.UtcNow;

        await supplierRepository.Update(supplier);
    }
}