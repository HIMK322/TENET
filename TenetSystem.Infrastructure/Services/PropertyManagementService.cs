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

        // Record rent payment with RentPeriod
        public async Task RecordRentPaymentAsync(
            int tenantId, 
            int unitId, 
            decimal amount, 
            DateTime paymentDate, 
            DateTime rentMonth, 
            RentPeriod rentPeriod,
            string paymentMethod, 
            string notes = null)
        {
            var receipt = new RentReceipt
            {
                TenantId = tenantId,
                UnitId = unitId,
                PaymentDate = paymentDate,
                RentMonth = new DateTime(rentMonth.Year, rentMonth.Month, 1),
                AmountPaid = amount,
                RentPeriod = rentPeriod,
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

        // Update unit with tenant history management
        public async Task UpdateUnitWithTenantManagementAsync(int unitId, int? newTenantId, decimal? newRentAmount = null)
        {
            // Get the current unit state
            var unit = await _unitRepository.GetByIdAsync(unitId);
            if (unit == null) return;
            
            var oldTenantId = unit.CurrentTenantId;
            
            // If tenant is changing, handle the history
            if (oldTenantId != newTenantId)
            {
                // Move out the old tenant if there was one
                if (oldTenantId.HasValue)
                {
                    var oldTenantHistory = await _tenantHistoryRepository.GetByUnitIdAsync(unitId);
                    var currentHistory = oldTenantHistory.FirstOrDefault(th => 
                        th.TenantId == oldTenantId.Value && 
                        th.MoveOutDate == null);
                    
                    if (currentHistory != null)
                    {
                        currentHistory.MoveOutDate = DateTime.Now;
                        await _tenantHistoryRepository.UpdateAsync(currentHistory);
                    }
                }
                
                // Move in the new tenant if there is one
                if (newTenantId.HasValue)
                {
                    var newTenantHistory = new TenantHistory
                    {
                        TenantId = newTenantId.Value,
                        UnitId = unitId,
                        MoveInDate = DateTime.Now
                    };
                    await _tenantHistoryRepository.AddAsync(newTenantHistory);
                }
                
                // Update the unit's current tenant
                unit.CurrentTenantId = newTenantId;
            }
            
            // Update rent amount if provided
            if (newRentAmount.HasValue)
            {
                unit.LastRentAmount = newRentAmount.Value;
            }
            
            await _unitRepository.UpdateAsync(unit);
        }
    }
}