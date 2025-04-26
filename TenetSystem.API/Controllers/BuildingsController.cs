using Microsoft.AspNetCore.Mvc;
using TenetSystem.API.DTOs;
using TenetSystem.API.Utilities;
using TenetSystem.Core.Models;
using TenetSystem.Infrastructure.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TenetSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BuildingsController : ControllerBase
    {
        private readonly BuildingRepository _buildingRepository;

        public BuildingsController(BuildingRepository buildingRepository)
        {
            _buildingRepository = buildingRepository;
        }

        // GET: api/Buildings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BuildingDto>>> GetBuildings()
        {
            var buildings = await _buildingRepository.GetAllAsync();
            return Ok(buildings.ToDtoList());
        }

        // GET: api/Buildings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BuildingDto>> GetBuilding(int id)
        {
            var building = await _buildingRepository.GetByIdAsync(id);
            
            if (building == null)
            {
                return NotFound();
            }

            return Ok(building.ToDto());
        }

        // POST: api/Buildings
        [HttpPost]
        public async Task<ActionResult<BuildingDto>> PostBuilding(Building building)
        {
            await _buildingRepository.AddAsync(building);
            return CreatedAtAction(nameof(GetBuilding), new { id = building.Id }, building.ToDto());
        }

        // PUT: api/Buildings/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBuilding(int id, Building building)
        {
            if (id != building.Id)
            {
                return BadRequest();
            }

            await _buildingRepository.UpdateAsync(building);
            return NoContent();
        }

        // DELETE: api/Buildings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBuilding(int id)
        {
            await _buildingRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}