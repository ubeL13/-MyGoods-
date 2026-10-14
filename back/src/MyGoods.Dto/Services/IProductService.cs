using MyGoods.Dto.Products;

namespace MyGoods.Dto.Services;

/// <summary>
/// Сервис товаров: бизнес-логика создания и редактирования.
/// </summary>
public interface IProductService
{
    /// <summary>
    /// Возвращает товар по идентификатору. Если товара нет — NotFoundException (404).
    /// </summary>
    /// <param name="id">Идентификатор товара</param>
    Task<ProductDto> GetById(Guid id);

    /// <summary>
    /// Создаёт товар с нулевым остатком.
    /// </summary>
    /// <param name="dto">Данные формы товара</param>
    /// <returns>Созданный товар</returns>
    Task<ProductDto> Create(ProductEditDto dto);

    /// <summary>
    /// Изменяет товар.
    /// </summary>
    /// <param name="id">Идентификатор товара</param>
    /// <param name="dto">Данные формы товара</param>
    /// <returns>Изменённый товар</returns>
    Task<ProductDto> Update(Guid id, ProductEditDto dto);

    /// <summary>
    /// Снимает товар с продажи или возвращает в продажу. Товар не удаляется.
    /// </summary>
    /// <param name="id">Идентификатор товара</param>
    /// <param name="isActive">True — в продаже, false — снят с продажи</param>
    /// <returns>Изменённый товар</returns>
    Task<ProductDto> SetActive(Guid id, bool isActive);
}
