using MyGoods.Application.Exceptions;
using MyGoods.Application.Helpers;
using MyGoods.Core.Entities;
using MyGoods.Core.Repositories;
using MyGoods.Dto;
using MyGoods.Dto.Customers;
using MyGoods.Dto.Services;

namespace MyGoods.Application.Services;

/// <summary>
/// Сервис покупателей.
/// </summary>
/// <param name="customerRepository">Репозиторий покупателей</param>
public class CustomerService(ICustomerRepository customerRepository) : ICustomerService
{
    /// <inheritdoc />
    public async Task<PagedResult<CustomerDto>> GetList(CustomerQueryDto query)
    {
        var (items, total) = await customerRepository.Search(query.Search, query.Page, query.Limit);

        var totalPages = (int)Math.Ceiling(total / (double)query.Limit);
        return new PagedResult<CustomerDto>(
            items.Select(MapperHelper.ToDto).ToList(),
            new PageMeta(query.Page, query.Limit, total, totalPages));
    }

    /// <inheritdoc />
    public async Task<CustomerDto> GetById(Guid id)
    {
        var customer = await customerRepository.Read(id)
            ?? throw new NotFoundException($"Покупатель с id {id} не найден.");

        return MapperHelper.ToDto(customer);
    }

    /// <inheritdoc />
    public async Task<CustomerDto> Create(CustomerCreateDto dto)
    {
        var phone = PhoneHelper.Normalize(dto.Phone)
            ?? throw new ValidationException("Неверный формат телефона. Пример: +7 999 123-45-67.");

        if (await customerRepository.PhoneExists(phone))
            throw new ConflictException($"Покупатель с телефоном {phone} уже есть.");

        var now = DateTime.UtcNow;
        var customer = new Customer
        {
            Name = dto.Name.Trim(),
            Phone = phone,
            Email = string.IsNullOrWhiteSpace(dto.Email) ? null : dto.Email.Trim(),
            Address = string.IsNullOrWhiteSpace(dto.Address) ? null : dto.Address.Trim(),
            CreatedAt = now,
            UpdatedAt = now
        };

        await customerRepository.Create(customer);
        return MapperHelper.ToDto(customer);
    }
}
