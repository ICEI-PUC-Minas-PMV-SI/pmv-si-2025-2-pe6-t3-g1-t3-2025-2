using HotelFazendaApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace HotelFazendaApi.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();
        }
    }
}
