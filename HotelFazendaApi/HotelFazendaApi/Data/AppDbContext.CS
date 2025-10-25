using HotelFazendaApi.Entities;
using Microsoft.EntityFrameworkCore;

namespace HotelFazendaApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // DbSets
        public DbSet<User> Users => Set<User>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<Produto> Produtos => Set<Produto>();
        public DbSet<Room> Rooms => Set<Room>();
        public DbSet<Reservation> Reservations => Set<Reservation>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // schema padrão do PostgreSQL
            modelBuilder.HasDefaultSchema("public");

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

                e.HasIndex(p => p.Numero).IsUnique();
            });

            // Reservation
            modelBuilder.Entity<Reservation>(e =>
            {
                e.Property(p => p.HospedeNome)
                    .HasMaxLength(120)
                    .IsRequired();

                e.Property(p => p.HospedeDocumento).HasMaxLength(40);
                e.Property(p => p.Telefone).HasMaxLength(40);

                e.Property(p => p.Status)
                    .HasMaxLength(20)
                    .HasDefaultValue("Aberta");

                // FK para quarto (sem cascade delete)
                e.HasOne(p => p.Quarto)
                    .WithMany()
                    .HasForeignKey(p => p.QuartoId)
                    .OnDelete(DeleteBehavior.Restrict);

                e.HasIndex(p => new { p.DataEntrada, p.DataSaida });
            });

            // (Opcional) Se Produto tiver preço/valor decimal, descomente:
            // modelBuilder.Entity<Produto>()
            //     .Property(p => p.Preco)
            //     .HasPrecision(18, 2);
        }
    }
}
