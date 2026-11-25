using Microsoft.AspNetCore.Mvc;
using MyGoods.Dto;
using MyGoods.Dto.Services;
using MyGoods.Dto.WriteOffs;

namespace MyGoods.Api.Controllers;

/// <summary>Заявки на списание товаров.</summary>
[ApiController]
[Route("api/v1/write-offs")]
public class WriteOffsController(IWriteOffService writeOffService) : ControllerBase
{
    /// <summary>Список заявок с фильтрами по статусу, причине и поиском.</summary>
    [HttpGet]
    [ProducesResponseType<PagedResult<WriteOffDto>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<WriteOffDto>>> GetList([FromQuery] WriteOffQueryDto query) =>
        Ok(await writeOffService.GetList(query));

    /// <summary>Карточка заявки.</summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType<WriteOffDto>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<WriteOffDto>> GetById(Guid id) =>
        Ok(await writeOffService.GetById(id));

    /// <summary>Создать заявку на списание.</summary>
    [HttpPost]
    [ProducesResponseType<WriteOffDto>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<WriteOffDto>> Create(WriteOffCreateDto dto)
    {
        var writeOff = await writeOffService.Create(dto);
        return CreatedAtAction(nameof(GetById), new { id = writeOff.Id }, writeOff);
    }
}