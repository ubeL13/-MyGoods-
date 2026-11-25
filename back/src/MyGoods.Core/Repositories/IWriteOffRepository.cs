using MyGoods.Core.Entities;
using MyGoods.Core.Enums;

namespace MyGoods.Core.Repositories;

/// <summary>Репозиторий заявок на списание.</summary>
public interface IWriteOffRepository : IRepository<WriteOff>
{
    Task<(List<WriteOff> Items, int Total)> Search(WriteOffStatus? status, WriteOffReason? reason, string? search, int page, int limit);
}

