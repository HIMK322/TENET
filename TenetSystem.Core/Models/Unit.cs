
using System.Collections.Generic;

namespace TenetSystem.Core.Models
{
    public class Unit
    {
        public int Id { get; set; }
        public int BuildingId { get; set; }
        public string UnitNumber { get; set; }
        public UnitType Type { get; set; }
        public decimal LastRentAmount { get; set; }
        public int? CurrentTenantId { get; set; }
        
        // Navigation properties
        public Building? Building { get; set; }
        public Tenant? CurrentTenant { get; set; }
        public ICollection<RentReceipt> RentReceipts { get; set; } = new List<RentReceipt>();
        public ICollection<TenantHistory> TenantHistories { get; set; } = new List<TenantHistory>();
    }
}