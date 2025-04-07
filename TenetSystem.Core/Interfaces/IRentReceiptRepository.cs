using TenetSystem.Core.Models;

namespace TenetSystem.Core.Interfaces
{
    public interface IRentReceiptRepository : IRepository<RentReceipt>
    {
        Task<List<RentReceipt>> GetByTenantIdAsync(int tenantId);
        Task<List<RentReceipt>> GetByUnitIdAsync(int unitId);
    }
}