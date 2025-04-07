using TenetSystem.Core.Models;

namespace TenetSystem.Core.Interfaces
{
    public interface ITenantHistoryRepository : IRepository<TenantHistory>
    {
        Task<List<TenantHistory>> GetByUnitIdAsync(int unitId);
    }
}