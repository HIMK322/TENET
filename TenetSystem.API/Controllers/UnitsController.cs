using Microsoft.AspNetCore.Mvc;
using TenetSystem.Core.Models;
using TenetSystem.Infrastructure.Services;
using TenetSystem.Infrastructure.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TenetSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UnitsController : ControllerBase
    {
        private readonly UnitRepository _unitRepository;

        public UnitsController(UnitRepository unitRepository)
        {
            _unitRepository = unitRepository;
        }

        // GET: api/Units
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Unit>>> GetUnits()
        {
            var units = await _unitRepository.GetAllAsync();
            return Ok(units);
        }

        // GET: api/Units/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Unit>> GetUnit(int id)
        {
            var unit = await _unitRepository.GetByIdAsync(id);
            
            if (unit == null)
            {
                return NotFound();
            }

            return Ok(unit);
        }

        // GET: api/Units/Vacant
        [HttpGet("vacant")]
        public async Task<ActionResult<IEnumerable<Unit>>> GetVacantUnits()
        {
            var units = await _unitRepository.GetVacantUnitsAsync();
            return Ok(units);
        }

        // POST: api/Units
        [HttpPost]
        public async Task<ActionResult<Unit>> PostUnit(Unit unit)
        {
            await _unitRepository.AddAsync(unit);
            return CreatedAtAction(nameof(GetUnit), new { id = unit.Id }, unit);
        }

        // PUT: api/Units/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUnit(int id, Unit unit)
        {
            if (id != unit.Id)
            {
                return BadRequest();
            }

            await _unitRepository.UpdateAsync(unit);
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