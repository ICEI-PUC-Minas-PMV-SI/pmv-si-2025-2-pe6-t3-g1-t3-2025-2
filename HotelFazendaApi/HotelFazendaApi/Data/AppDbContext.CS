using HotelFazendaApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace HotelFazendaApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Order> Orders { get; set; } = null!;
        public DbSet<Produto> Produtos { get; set; } = null!;
        public DbSet<Room> Rooms => Set<Room>();
        public DbSet<Reservation> Reservations => Set<Reservation>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User: persiste o enum como string
            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            // Room
            modelBuilder.Entity<Room>(e =>
            {
                e.Property(p => p.Numero)
                    .HasMaxLength(10)
                    .IsRequired();

                e.Property(p => p.Capacidade)
                    .HasDefaultValue(2);

                e.Property(p => p.Status)
                    .HasMaxLength(20)
                    .HasDefaultValue("Livre");

                // Índice único pelo número do quarto
                e.HasIndex(p => p.Numero)
                    .IsUnique();
            });

            // Reservation
            modelBuilder.Entity<Reservation>(e =>
            {
                e.Property(p => p.HospedeNome)
                    .HasMaxLength(120)
                    .IsRequired();

                e.Property(p => p.HospedeDocumento)
                    .HasMaxLength(40);

                e.Property(p => p.Telefone)
                    .HasMaxLength(40);

                e.Property(p => p.Status)
                    .HasMaxLength(20)
                    .HasDefaultValue("Aberta");

                // FK para quarto (sem cascade delete)
                e.HasOne(p => p.Quarto)
                    .WithMany()
                    .HasForeignKey(p => p.QuartoId)
                    .OnDelete(DeleteBehavior.Restrict);

                // Índice para acelerar buscas por período
                e.HasIndex(p => new { p.DataEntrada, p.DataSaida });
            });
        }
    }
}
