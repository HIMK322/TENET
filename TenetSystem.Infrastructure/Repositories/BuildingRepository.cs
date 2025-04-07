using Microsoft.EntityFrameworkCore;
using TenetSystem.Core.Interfaces;
using TenetSystem.Core.Models;
using TenetSystem.Infrastructure.Data;


namespace TenetSystem.Infrastructure.Repositories
{
    public class BuildingRepository : IRepository<Building>
    {
        private readonly PropertyDbContext _context;

        public BuildingRepository(PropertyDbContext context)
        {
            _context = context;
        }

        public async Task<List<Building>> GetAllAsync()
        {
            return await _context.Buildings.Include(b => b.Units).ToListAsync();
        }

        public async Task<Building> GetByIdAsync(int id)
        {
            return await _context.Buildings
                .Include(b => b.Units)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<Building> AddAsync(Building building)
        {
            _context.Buildings.Add(building);
            await _context.SaveChangesAsync();
            return building;
        }

        public async Task UpdateAsync(Building building)
        {
            _context.Entry(building).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var building = await _context.Buildings.FindAsync(id);
            if (building != null)
            {
                _context.Buildings.Remove(building);
                await _context.SaveChangesAsync();
            }
        }
    }
}