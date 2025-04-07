using TenetSystem.Core.Models;
using TenetSystem.Infrastructure.Repositories;

namespace TenetSystem.Infrastructure.Services
{
    public class TenetSystemService
    {
        private readonly BuildingRepository _buildingRepository;
        private readonly UnitRepository _unitRepository;
        private readonly TenantRepository _tenantRepository;
        private readonly RentReceiptRepository _rentReceiptRepository;
        private readonly TenantHistoryRepository _tenantHistoryRepository;

        public TenetSystemService(
            BuildingRepository buildingRepository,
            UnitRepository unitRepository,
            TenantRepository tenantRepository,
            RentReceiptRepository rentReceiptRepository,
            TenantHistoryRepository tenantHistoryRepository)
        {
            _buildingRepository = buildingRepository;
            _unitRepository = unitRepository;
            _tenantRepository = tenantRepository;
            _rentReceiptRepository = rentReceiptRepository;
            _tenantHistoryRepository = tenantHistoryRepository;
        }

        // Tenant move-in process
        public async Task MoveInTenantAsync(int unitId, Tenant tenant, decimal rentAmount)
        {
            // Add the new tenant
            await _tenantRepository.AddAsync(tenant);
            
            // Update the unit with new tenant
            var unit = await _unitRepository.GetByIdAsync(unitId);
            unit.CurrentTenantId = tenant.Id;
            unit.LastRentAmount = rentAmount;
            await _unitRepository.UpdateAsync(unit);
            
            // Create tenant history record
            var tenantHistory = new TenantHistory
            {
                TenantId = tenant.Id,
                UnitId = unitId,
                MoveInDate = DateTime.Now
            };
            await _tenantHistoryRepository.AddAsync(tenantHistory);
        }

        // Tenant move-out process
        public async Task MoveOutTenantAsync(int unitId)
        {
            var unit = await _unitRepository.GetByIdAsync(unitId);
            if (unit.CurrentTenantId.HasValue)
            {
                // Update tenant record
                var tenant = await _tenantRepository.GetByIdAsync(unit.CurrentTenantId.Value);
                tenant.MoveOutDate = DateTime.Now;
                await _tenantRepository.UpdateAsync(tenant);
                
                // Update tenant history record
                var tenantHistory = await _tenantHistoryRepository.GetByUnitIdAsync(unitId);
                var currentTenantHistory = tenantHistory.Find(th => 
                    th.TenantId == unit.CurrentTenantId.Value && 
                    th.MoveOutDate == null);
                
                if (currentTenantHistory != null)
                {
                    currentTenantHistory.MoveOutDate = DateTime.Now;
                    await _tenantHistoryRepository.UpdateAsync(currentTenantHistory);
                }
                
                // Update unit to vacant
                unit.CurrentTenantId = null;
                await _unitRepository.UpdateAsync(unit);
            }
        }

        // Record rent payment
        public async Task RecordRentPaymentAsync(int tenantId, int unitId, decimal amount, DateTime rentMonth, string paymentMethod, string notes = null)
        {
            var receipt = new RentReceipt
            {
                TenantId = tenantId,
                UnitId = unitId,
                PaymentDate = DateTime.Now,
                RentMonth = new DateTime(rentMonth.Year, rentMonth.Month, 1),
                AmountPaid = amount,
                PaymentMethod = paymentMethod,
                Notes = notes
            };
            
            await _rentReceiptRepository.AddAsync(receipt);
            
            // Update last rent amount on unit
            var unit = await _unitRepository.GetByIdAsync(unitId);
            unit.LastRentAmount = amount;
            await _unitRepository.UpdateAsync(unit);
        }

        // Get rent payment history for a tenant
        public async Task<List<RentReceipt>> GetTenantRentHistoryAsync(int tenantId)
        {
            return await _rentReceiptRepository.GetByTenantIdAsync(tenantId);
        }

        // Get occupancy history for a unit
        public async Task<List<TenantHistory>> GetUnitOccupancyHistoryAsync(int unitId)
        {
            return await _tenantHistoryRepository.GetByUnitIdAsync(unitId);
        }

        // Get vacant units
        public async Task<List<Unit>> GetVacantUnitsAsync()
        {
            return await _unitRepository.GetVacantUnitsAsync();
        }

        // Get current tenants
        public async Task<List<Tenant>> GetCurrentTenantsAsync()
        {
            return await _tenantRepository.GetCurrentTenantsAsync();
        }
    }
}