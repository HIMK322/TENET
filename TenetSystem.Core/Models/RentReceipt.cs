using System;

namespace TenetSystem.Core.Models
{
    public class RentReceipt
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public int UnitId { get; set; }
        public DateTime PaymentDate { get; set; }
        public DateTime RentMonth { get; set; }
        public decimal AmountPaid { get; set; }
        public string? PaymentMethod { get; set; }
        public string? Notes { get; set; }
        
        // Navigation properties
        public Tenant Tenant { get; set; }
        public Unit Unit { get; set; }
    }
}