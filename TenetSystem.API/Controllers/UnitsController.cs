using Microsoft.AspNetCore.Mvc;
using TenetSystem.API.DTOs;
using TenetSystem.API.Utilities;
using TenetSystem.Core.Models;
using TenetSystem.Infrastructure.Repositories;
using TenetSystem.Infrastructure.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TenetSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UnitsController : ControllerBase
    {
        private readonly UnitRepository _unitRepository;
        private readonly TenetSystemService _tenetSystemService;

        public UnitsController(UnitRepository unitRepository, TenetSystemService tenetSystemService) // Add service
        {
            _unitRepository = unitRepository;
            _tenetSystemService = tenetSystemService; // Add this
        }


        public UnitsController(UnitRepository unitRepository)
        {
            _unitRepository = unitRepository;
        }

        // GET: api/Units
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UnitDto>>> GetUnits()
        {
            var units = await _unitRepository.GetAllAsync();
            return Ok(units.ToDtoList());
        }

        // GET: api/Units/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UnitDto>> GetUnit(int id)
        {
            var unit = await _unitRepository.GetByIdAsync(id);
            
            if (unit == null)
            {
                return NotFound();
            }

            return Ok(unit.ToDto());
        }

        // GET: api/Units/Vacant
        [HttpGet("vacant")]
        public async Task<ActionResult<IEnumerable<UnitDto>>> GetVacantUnits()
        {
            var units = await _unitRepository.GetVacantUnitsAsync();
            return Ok(units.ToDtoList());
        }

        // POST: api/Units
        [HttpPost]
        public async Task<ActionResult<UnitDto>> PostUnit(Unit unit)
        {
            await _unitRepository.AddAsync(unit);
            return CreatedAtAction(nameof(GetUnit), new { id = unit.Id }, unit.ToDto());
        }

        // PUT: api/Units/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUnit(int id, Unit unit)
        {
            if (id != unit.Id)
            {
                return BadRequest();
            }

            // Get the existing unit to check if tenant changed
            var existingUnit = await _unitRepository.GetByIdAsync(id);
            if (existingUnit == null)
            {
                return NotFound();
            }

            // Check if CurrentTenantId has changed
            if (existingUnit.CurrentTenantId != unit.CurrentTenantId)
            {
                // Use the service method to handle tenant history
                await _tenetSystemService.UpdateUnitWithTenantManagementAsync(
                    id, 
                    unit.CurrentTenantId, 
                    unit.LastRentAmount
                );
            }
            else
            {
                // Just update the unit normally if tenant hasn't changed
                await _unitRepository.UpdateAsync(unit);
            }
            
            return NoContent();
        }

        // DELETE: api/Units/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUnit(int id)
        {
            await _unitRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}