using System.Collections.Generic;

namespace TenetSystem.Core.Models
{
    public class Building
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? LayoutMap { get; set; }
        public string Address { get; set; }
        public string? Description { get; set; }
        
        // Navigation properties
        public ICollection<Unit> Units { get; set; } = new List<Unit>();
    }
}