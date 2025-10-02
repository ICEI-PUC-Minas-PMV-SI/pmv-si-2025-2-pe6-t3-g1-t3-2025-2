using HotelFazendaApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace HotelFazendaApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuração de User
            modelBuilder
                .Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();
        }
    }
}
