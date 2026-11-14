using MyGoods.Dto.Suppliers;

namespace MyGoods.Dto.Services;

/// <summary>
/// Сервис поставщиков: список с поиском, карточка, создание, редактирование, архивация.
/// </summary>
public interface ISupplierService
{
    /// <summary>
    /// Список поставщиков с поиском по названию, ИНН или телефону и пагинацией.
    /// </summary>
    /// <param name="query">Параметры списка</param>
    Task<PagedResult<SupplierDto>> GetList(SupplierQueryDto query);

    /// <summary>
    /// Поставщик по идентификатору. Если нет - NotFoundException (404).
    /// </summary>
    /// <param name="id">Идентификатор поставщика</param>
    Task<SupplierDto> GetById(Guid id);

    /// <summary>
    /// Создаёт поставщика. Телефон нормализуется; если название уже есть - ConflictException (409).
    /// </summary>
    /// <param name="dto">Данные поставщика</param>
    Task<SupplierDto> Create(SupplierCreateDto dto);

    /// <summary>
    /// Редактирует поставщика. Если название уже занято другим - ConflictException (409).
    /// </summary>
    /// <param name="id">Идентификатор поставщика</param>
    /// <param name="dto">Новые данные</param>
    Task<SupplierDto> Update(Guid id, SupplierEditDto dto);

    /// <summary>
    /// Архивирует поставщика (IsActive = false).
    /// </summary>
    /// <param name="id">Идентификатор поставщика</param>
    Task Archive(Guid id);
}