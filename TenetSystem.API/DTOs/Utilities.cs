using System.Collections.Generic;
using System.Linq;
using TenetSystem.API.DTOs;
using TenetSystem.Core.Models;

namespace TenetSystem.API.Utilities
{
    public static class DtoMapper
    {
        // Building Mappers
        public static BuildingDto ToDto(this Building building)
        {
            if (building == null) return null;
            
            return new BuildingDto
            {
                Id = building.Id,
                Name = building.Name,
                LayoutMap = building.LayoutMap,
                Address = building.Address,
                Description = building.Description,
                Units = building.Units?.Select(u => u.ToSummaryDto()).ToList() ?? new List<UnitSummaryDto>()
            };
        }

        public static BuildingSummaryDto ToSummaryDto(this Building building)
        {
            if (building == null) return null;
            
            return new BuildingSummaryDto
            {
                Id = building.Id,
                Name = building.Name,
                Address = building.Address
            };
        }

        public static List<BuildingDto> ToDtoList(this IEnumerable<Building> buildings)
        {
            return buildings?.Select(b => b.ToDto()).ToList() ?? new List<BuildingDto>();
        }

        // Unit Mappers
        public static UnitDto ToDto(this Unit unit)
        {
            if (unit == null) return null;
            
            return new UnitDto
            {
                Id = unit.Id,
                BuildingId = unit.BuildingId,
                UnitNumber = unit.UnitNumber,
                Type = unit.Type.ToString(),
                LastRentAmount = unit.LastRentAmount,
                CurrentTenantId = unit.CurrentTenantId,
                Building = unit.Building?.ToSummaryDto(),
                CurrentTenant = unit.CurrentTenant?.ToSummaryDto()
            };
        }

        public static UnitSummaryDto ToSummaryDto(this Unit unit)
        {
            if (unit == null) return null;
            
            return new UnitSummaryDto
            {
                Id = unit.Id,
                UnitNumber = unit.UnitNumber,
                Type = unit.Type.ToString(),
                CurrentTenantId = unit.CurrentTenantId,
                LastRentAmount = unit.LastRentAmount
            };
        }

        public static List<UnitDto> ToDtoList(this IEnumerable<Unit> units)
        {
            return units?.Select(u => u.ToDto()).ToList() ?? new List<UnitDto>();
        }

        // Tenant Mappers
        public static TenantDto ToDto(this Tenant tenant)
        {
            if (tenant == null) return null;
            
            return new TenantDto
            {
                Id = tenant.Id,
                Name = tenant.Name,
                PhoneNumber = tenant.PhoneNumber,
                Email = tenant.Email,
                Address = tenant.Address,
                MoveInDate = tenant.MoveInDate,
                MoveOutDate = tenant.MoveOutDate,
                Units = tenant.Units?.Select(u => u.ToSummaryDto()).ToList() ?? new List<UnitSummaryDto>()
            };
        }

        public static TenantSummaryDto ToSummaryDto(this Tenant tenant)
        {
            if (tenant == null) return null;
            
            return new TenantSummaryDto
            {
                Id = tenant.Id,
                Name = tenant.Name,
                PhoneNumber = tenant.PhoneNumber,
                Email = tenant.Email
            };
        }

        public static List<TenantDto> ToDtoList(this IEnumerable<Tenant> tenants)
        {
            return tenants?.Select(t => t.ToDto()).ToList() ?? new List<TenantDto>();
        }

        // RentReceipt Mappers
        public static RentReceiptDto ToDto(this RentReceipt receipt)
        {
            if (receipt == null) return null;
            
            return new RentReceiptDto
            {
                Id = receipt.Id,
                TenantId = receipt.TenantId,
                UnitId = receipt.UnitId,
                PaymentDate = receipt.PaymentDate,
                RentMonth = receipt.RentMonth,
                AmountPaid = receipt.AmountPaid,
                PaymentMethod = receipt.PaymentMethod,
                Notes = receipt.Notes,
                Tenant = receipt.Tenant?.ToSummaryDto(),
                Unit = receipt.Unit?.ToSummaryDto()
            };
        }

        public static List<RentReceiptDto> ToDtoList(this IEnumerable<RentReceipt> receipts)
        {
            return receipts?.Select(r => r.ToDto()).ToList() ?? new List<RentReceiptDto>();
        }

        // TenantHistory Mappers
        public static TenantHistoryDto ToDto(this TenantHistory history)
        {
            if (history == null) return null;
            
            return new TenantHistoryDto
            {
                Id = history.Id,
                TenantId = history.TenantId,
                UnitId = history.UnitId,
                MoveInDate = history.MoveInDate,
                MoveOutDate = history.MoveOutDate,
                Tenant = history.Tenant?.ToSummaryDto(),
                Unit = history.Unit?.ToSummaryDto()
            };
        }

        public static List<TenantHistoryDto> ToDtoList(this IEnumerable<TenantHistory> histories)
        {
            return histories?.Select(h => h.ToDto()).ToList() ?? new List<TenantHistoryDto>();
        }
    }
}