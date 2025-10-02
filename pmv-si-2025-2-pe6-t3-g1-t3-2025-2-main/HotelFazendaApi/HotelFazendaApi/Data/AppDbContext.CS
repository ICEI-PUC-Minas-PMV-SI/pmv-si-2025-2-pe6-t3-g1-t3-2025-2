using HotelFazendaApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace HotelFazendaApi.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<Order>()
              .HasMany(o => o.Items)
             .WithOne(i => i.Order!)
             .HasForeignKey(i => i.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
                
                // Order ↔ OrderItem (1:N) + Cascade delete
            modelBuilder.Entity<Order>()
                .HasMany(o => o.Items)
                .WithOne(i => i.Order!)
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Tipos decimais (precisão para dinheiro)
            modelBuilder.Entity<Order>()
                .Property(p => p.TotalAmount)
                .HasColumnType("decimal(12,2)");

            modelBuilder.Entity<OrderItem>()
                .Property(p => p.UnitPrice)
                .HasColumnType("decimal(12,2)");

            modelBuilder.Entity<OrderItem>()
                .Property(p => p.LineTotal)
                .HasColumnType("decimal(12,2)");

            // Índices úteis
            modelBuilder.Entity<Order>()
                .HasIndex(o => new { o.UserId, o.CreatedAt });

            modelBuilder.Entity<OrderItem>()
                .HasIndex(i => i.OrderId);
        }
    }
}
