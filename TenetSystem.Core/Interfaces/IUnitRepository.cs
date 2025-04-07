using TenetSystem.Core.Models;

namespace TenetSystem.Core.Interfaces
{
    public interface IUnitRepository : IRepository<Unit>
    {
        Task<List<Unit>> GetVacantUnitsAsync();
    }
}
