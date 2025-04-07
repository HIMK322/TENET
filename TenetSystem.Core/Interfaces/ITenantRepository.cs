using TenetSystem.Core.Models;

namespace TenetSystem.Core.Interfaces
{
    public interface ITenantRepository : IRepository<Tenant>
    {
        Task<List<Tenant>> GetCurrentTenantsAsync();
    }
}
