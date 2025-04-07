using Microsoft.EntityFrameworkCore;
using TenetSystem.Core.Interfaces;
using TenetSystem.Core.Models;
using TenetSystem.Infrastructure.Data;

namespace TenetSystem.Infrastructure.Repositories
{
    public class TenantRepository : IRepository<Tenant>
    {
        private readonly PropertyDbContext _context;

        public TenantRepository(PropertyDbContext context)
        {
            _context = context;
        }

        public async Task<List<Tenant>> GetAllAsync()
        {
            return await _context.Tenants.ToListAsync();
        }

        public async Task<Tenant> GetByIdAsync(int id)
        {
            return await _context.Tenants
                .Include(t => t.Units)
                .Include(t => t.RentReceipts)
                .Include(t => t.TenantHistories)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async Task<List<Tenant>> GetCurrentTenantsAsync()
        {
            return await _context.Tenants
                .Where(t => t.MoveOutDate == null)
                .ToListAsync();
        }

        public async Task<Tenant> AddAsync(Tenant tenant)
        {
            _context.Tenants.Add(tenant);
            await _context.SaveChangesAsync();
            return tenant;
        }

        public async Task UpdateAsync(Tenant tenant)
        {
            _context.Entry(tenant).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var tenant = await _context.Tenants.FindAsync(id);
            if (tenant != null)
            {
                _context.Tenants.Remove(tenant);
                await _context.SaveChangesAsync();
            }
        }
    }
}