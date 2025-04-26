using System;
using System.Collections.Generic;
using TenetSystem.Core.Models;

namespace TenetSystem.API.DTOs
{
    // Building DTOs
    public class BuildingDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string LayoutMap { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public List<UnitSummaryDto> Units { get; set; } = new List<UnitSummaryDto>();
    }

    public class BuildingSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
    }

    // Unit DTOs
    public class UnitDto
    {
        public int Id { get; set; }
        public int BuildingId { get; set; }
        public string UnitNumber { get; set; }
        public string Type { get; set; }
        public decimal LastRentAmount { get; set; }
        public int? CurrentTenantId { get; set; }
        public BuildingSummaryDto Building { get; set; }
        public TenantSummaryDto CurrentTenant { get; set; }
    }

    public class UnitSummaryDto
    {
        public int Id { get; set; }
        public string UnitNumber { get; set; }
        public string Type { get; set; }
        public bool IsOccupied => CurrentTenantId.HasValue;
        public int? CurrentTenantId { get; set; }
        public decimal LastRentAmount { get; set; }
    }

    // Tenant DTOs
    public class TenantDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public DateTime MoveInDate { get; set; }
        public DateTime? MoveOutDate { get; set; }
        public List<UnitSummaryDto> Units { get; set; } = new List<UnitSummaryDto>();
    }

    public class TenantSummaryDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
    }

    // Rent Receipt DTOs
    public class RentReceiptDto
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public int UnitId { get; set; }
        public DateTime PaymentDate { get; set; }
        public DateTime RentMonth { get; set; }
        public decimal AmountPaid { get; set; }
        public string PaymentMethod { get; set; }
        public string Notes { get; set; }
        public TenantSummaryDto Tenant { get; set; }
        public UnitSummaryDto Unit { get; set; }
    }

    // Tenant History DTOs
    public class TenantHistoryDto
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public int UnitId { get; set; }
        public DateTime MoveInDate { get; set; }
        public DateTime? MoveOutDate { get; set; }
        public TenantSummaryDto Tenant { get; set; }
        public UnitSummaryDto Unit { get; set; }
    }

    // Request/Response DTOs
    public class RentPaymentRequestDto
    {
        public int TenantId { get; set; }
        public int UnitId { get; set; }
        public decimal Amount { get; set; }
        public DateTime RentMonth { get; set; }
        public string PaymentMethod { get; set; }
        public string Notes { get; set; }
    }

    public class MoveInRequestDto
    {
        public int UnitId { get; set; }
        public TenantDto Tenant { get; set; }
        public decimal RentAmount { get; set; }
    }
}