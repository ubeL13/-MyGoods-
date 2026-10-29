using MyGoods.Dto.Customers;

namespace MyGoods.Dto.Services;

/// <summary>
/// Сервис покупателей: список с поиском, карточка, создание.
/// </summary>
public interface ICustomerService
{
    /// <summary>
    /// Список покупателей с поиском по имени или телефону и пагинацией.
    /// </summary>
    /// <param name="query">Параметры списка</param>
    Task<PagedResult<CustomerDto>> GetList(CustomerQueryDto query);

    /// <summary>
    /// Покупатель по идентификатору. Если нет — NotFoundException (404).
    /// </summary>
    /// <param name="id">Идентификатор покупателя</param>
    Task<CustomerDto> GetById(Guid id);

    /// <summary>
    /// Создаёт покупателя. Телефон нормализуется; если такой уже есть — ConflictException (409).
    /// </summary>
    /// <param name="dto">Данные покупателя</param>
    Task<CustomerDto> Create(CustomerCreateDto dto);
}
