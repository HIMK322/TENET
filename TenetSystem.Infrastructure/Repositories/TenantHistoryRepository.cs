using Microsoft.EntityFrameworkCore;
using TenetSystem.Core.Interfaces;
using TenetSystem.Core.Models;
using TenetSystem.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TenetSystem.Infrastructure.Repositories
{
    public class TenantHistoryRepository : IRepository<TenantHistory>
    {
        private readonly PropertyDbContext _context;

        public TenantHistoryRepository(PropertyDbContext context)
        {
            _context = context;
        }

        public async Task<List<TenantHistory>> GetAllAsync()
        {
            return await _context.TenantHistories
                .Include(th => th.Tenant)
                .Include(th => th.Unit)
                .ToListAsync();
        }

        public async Task<TenantHistory> GetByIdAsync(int id)
        {
            return await _context.TenantHistories
                .Include(th => th.Tenant)
                .Include(th => th.Unit)
                .FirstOrDefaultAsync(th => th.Id == id);
        }

        public async Task<List<TenantHistory>> GetByUnitIdAsync(int unitId)
        {
            return await _context.TenantHistories
                .Where(th => th.UnitId == unitId)
                .Include(th => th.Tenant)
                .OrderByDescending(th => th.MoveInDate)
                .ToListAsync();
        }

        public async Task<TenantHistory> AddAsync(TenantHistory tenantHistory)
        {
            _context.TenantHistories.Add(tenantHistory);
            await _context.SaveChangesAsync();
            return tenantHistory;
        }

        public async Task UpdateAsync(TenantHistory tenantHistory)
        {
            _context.Entry(tenantHistory).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var tenantHistory = await _context.TenantHistories.FindAsync(id);
            if (tenantHistory != null)
            {
                _context.TenantHistories.Remove(tenantHistory);
                await _context.SaveChangesAsync();
            }
        }
    }
}