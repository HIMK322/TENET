using Microsoft.EntityFrameworkCore;
using TenetSystem.Core.Interfaces;
using TenetSystem.Core.Models;
using TenetSystem.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TenetSystem.Infrastructure.Repositories
{
    public class UnitRepository : IRepository<Unit>
    {
        private readonly PropertyDbContext _context;

        public UnitRepository(PropertyDbContext context)
        {
            _context = context;
        }

        public async Task<List<Unit>> GetAllAsync()
        {
            return await _context.Units
                .Include(u => u.Building)
                .Include(u => u.CurrentTenant)
                .ToListAsync();
        }

        public async Task<Unit> GetByIdAsync(int id)
        {
            return await _context.Units
                .Include(u => u.Building)
                .Include(u => u.CurrentTenant)
                .Include(u => u.RentReceipts)
                .Include(u => u.TenantHistories)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<List<Unit>> GetVacantUnitsAsync()
        {
            return await _context.Units
                .Where(u => u.CurrentTenantId == null)
                .Include(u => u.Building)
                .ToListAsync();
        }

        public async Task<Unit> AddAsync(Unit unit)
        {
            _context.Units.Add(unit);
            await _context.SaveChangesAsync();
            return unit;
        }

        public async Task UpdateAsync(Unit unit)
        {
            _context.Entry(unit).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var unit = await _context.Units.FindAsync(id);
            if (unit != null)
            {
                _context.Units.Remove(unit);
                await _context.SaveChangesAsync();
            }
        }
    }
}