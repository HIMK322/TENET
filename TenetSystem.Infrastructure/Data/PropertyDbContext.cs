using Microsoft.EntityFrameworkCore;
using TenetSystem.Core.Models;

namespace TenetSystem.Infrastructure.Data
{
    public class PropertyDbContext : DbContext
    {
        public PropertyDbContext(DbContextOptions<PropertyDbContext> options) : base(options)
        {
        }

        public DbSet<Building> Buildings { get; set; }
        public DbSet<Unit> Units { get; set; }
        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<RentReceipt> RentReceipts { get; set; }
        public DbSet<TenantHistory> TenantHistories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure Building
            modelBuilder.Entity<Building>()
                .HasMany(b => b.Units)
                .WithOne(u => u.Building)
                .HasForeignKey(u => u.BuildingId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Unit
            modelBuilder.Entity<Unit>()
                .HasOne(u => u.CurrentTenant)
                .WithMany(t => t.Units)
                .HasForeignKey(u => u.CurrentTenantId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure RentReceipt
            modelBuilder.Entity<RentReceipt>()
                .HasOne(r => r.Tenant)
                .WithMany(t => t.RentReceipts)
                .HasForeignKey(r => r.TenantId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<RentReceipt>()
                .HasOne(r => r.Unit)
                .WithMany(u => u.RentReceipts)
                .HasForeignKey(r => r.UnitId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure TenantHistory
            modelBuilder.Entity<TenantHistory>()
                .HasOne(th => th.Tenant)
                .WithMany(t => t.TenantHistories)
                .HasForeignKey(th => th.TenantId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<TenantHistory>()
                .HasOne(th => th.Unit)
                .WithMany(u => u.TenantHistories)
                .HasForeignKey(th => th.UnitId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}