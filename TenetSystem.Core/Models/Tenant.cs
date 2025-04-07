using System;
using System.Collections.Generic;

namespace TenetSystem.Core.Models
{
    public class Tenant
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public DateTime MoveInDate { get; set; }
        public DateTime? MoveOutDate { get; set; }
        
        // Navigation properties
        public ICollection<Unit> Units { get; set; } = new List<Unit>();
        public ICollection<RentReceipt> RentReceipts { get; set; } = new List<RentReceipt>();
        public ICollection<TenantHistory> TenantHistories { get; set; } = new List<TenantHistory>();
    }
}