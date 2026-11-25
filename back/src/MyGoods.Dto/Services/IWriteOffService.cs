using MyGoods.Dto;
using MyGoods.Dto.WriteOffs;

namespace MyGoods.Dto.Services;

public interface IWriteOffService
{
    Task<PagedResult<WriteOffDto>> GetList(WriteOffQueryDto query);
    Task<WriteOffDto> GetById(Guid id);
    Task<WriteOffDto> Create(WriteOffCreateDto dto);
}