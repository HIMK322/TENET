using Microsoft.AspNetCore.Mvc;
using TenetSystem.API.DTOs;
using TenetSystem.API.Utilities;
using TenetSystem.Core.Models;
using TenetSystem.Infrastructure.Services;
using TenetSystem.Infrastructure.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TenetSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TenantsController : ControllerBase
    {
        private readonly TenantRepository _tenantRepository;
        private readonly TenetSystemService _propertyService;

        public TenantsController(
            TenantRepository tenantRepository, 
            TenetSystemService propertyService)
        {
            _tenantRepository = tenantRepository;
            _propertyService = propertyService;
        }

        // GET: api/Tenants
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TenantDto>>> GetTenants()
        {
            var tenants = await _tenantRepository.GetAllAsync();
            return Ok(tenants.ToDtoList());
        }

        // GET: api/Tenants/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TenantDto>> GetTenant(int id)
        {
            var tenant = await _tenantRepository.GetByIdAsync(id);
            
            if (tenant == null)
            {
                return NotFound();
            }

            return Ok(tenant.ToDto());
        }

        // GET: api/Tenants/Current
        [HttpGet("current")]
        public async Task<ActionResult<IEnumerable<TenantDto>>> GetCurrentTenants()
        {
            var tenants = await _propertyService.GetCurrentTenantsAsync();
            return Ok(tenants.ToDtoList());
        }

        // GET: api/Tenants/5/RentHistory
        [HttpGet("{id}/RentHistory")]
        public async Task<ActionResult<IEnumerable<RentReceiptDto>>> GetTenantRentHistory(int id)
        {
            var rentHistory = await _propertyService.GetTenantRentHistoryAsync(id);
            return Ok(rentHistory.ToDtoList());
        }

        // POST: api/Tenants
        [HttpPost]
        public async Task<ActionResult<TenantDto>> PostTenant(Tenant tenant)
        {
            await _tenantRepository.AddAsync(tenant);
            return CreatedAtAction(nameof(GetTenant), new { id = tenant.Id }, tenant.ToDto());
        }

        // POST: api/Tenants/MoveIn
        [HttpPost("MoveIn")]
        public async Task<ActionResult> MoveInTenant([FromBody] MoveInRequestDto request)
        {
            // Convert DTO to entity
            var tenant = new Tenant
            {
                Name = request.Tenant.Name,
                PhoneNumber = request.Tenant.PhoneNumber,
                Email = request.Tenant.Email,
                Address = request.Tenant.Address,
                MoveInDate = request.Tenant.MoveInDate
            };
            
            await _propertyService.MoveInTenantAsync(request.UnitId, tenant, request.RentAmount);
            return Ok();
        }

        // POST: api/Tenants/MoveOut
        [HttpPost("MoveOut/{unitId}")]
        public async Task<ActionResult> MoveOutTenant(int unitId)
        {
            await _propertyService.MoveOutTenantAsync(unitId);
            return Ok();
        }

        // PUT: api/Tenants/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTenant(int id, Tenant tenant)
        {
            if (id != tenant.Id)
            {
                return BadRequest();
            }

            await _tenantRepository.UpdateAsync(tenant);
            return NoContent();
        }

        // DELETE: api/Tenants/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTenant(int id)
        {
            await _tenantRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}