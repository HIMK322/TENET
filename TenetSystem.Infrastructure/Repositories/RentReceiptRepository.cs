using Microsoft.EntityFrameworkCore;
using TenetSystem.Core.Interfaces;
using TenetSystem.Core.Models;
using TenetSystem.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TenetSystem.Infrastructure.Repositories
{
    public class RentReceiptRepository : IRepository<RentReceipt>
    {
        private readonly PropertyDbContext _context;

        public RentReceiptRepository(PropertyDbContext context)
        {
            _context = context;
        }

        public async Task<List<RentReceipt>> GetAllAsync()
        {
            return await _context.RentReceipts
                .Include(r => r.Tenant)
                .Include(r => r.Unit)
                .ToListAsync();
        }

        public async Task<RentReceipt> GetByIdAsync(int id)
        {
            return await _context.RentReceipts
                .Include(r => r.Tenant)
                .Include(r => r.Unit)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<List<RentReceipt>> GetByTenantIdAsync(int tenantId)
        {
            return await _context.RentReceipts
                .Where(r => r.TenantId == tenantId)
                .Include(r => r.Unit)
                .OrderByDescending(r => r.RentMonth)
                .ToListAsync();
        }

        public async Task<List<RentReceipt>> GetByUnitIdAsync(int unitId)
        {
            return await _context.RentReceipts
                .Where(r => r.UnitId == unitId)
                .Include(r => r.Tenant)
                .OrderByDescending(r => r.RentMonth)
                .ToListAsync();
        }

        public async Task<RentReceipt> AddAsync(RentReceipt rentReceipt)
        {
            _context.RentReceipts.Add(rentReceipt);
            await _context.SaveChangesAsync();
            return rentReceipt;
        }

        public async Task UpdateAsync(RentReceipt rentReceipt)
        {
            _context.Entry(rentReceipt).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var rentReceipt = await _context.RentReceipts.FindAsync(id);
            if (rentReceipt != null)
            {
                _context.RentReceipts.Remove(rentReceipt);
                await _context.SaveChangesAsync();
            }
        }
    }
}