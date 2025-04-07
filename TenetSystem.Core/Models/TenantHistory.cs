using System;

namespace TenetSystem.Core.Models
{
    public class TenantHistory
    {
        public int Id { get; set; }
        public int TenantId { get; set; }
        public int UnitId { get; set; }
        public DateTime MoveInDate { get; set; }
        public DateTime? MoveOutDate { get; set; }
        
        // Navigation properties
        public Tenant Tenant { get; set; }
        public Unit Unit { get; set; }
    }
}