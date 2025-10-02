using HotelFazendaApi.Entities;
using HotelFazendaApi.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HotelFazendaApi.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly Data.AppDbContext _db;
        public OrderRepository(Data.AppDbContext db) => _db = db;

        public async Task<Order> AddAsync(Order order, CancellationToken ct = default)
        {
            _db.Orders.Add(order);
            await _db.SaveChangesAsync(ct);
            return order;
        }

        public async Task<Order?> GetForUserAsync(int id, int userId, bool asAdmin, CancellationToken ct = default)
        {
            var q = _db.Orders.Include(o => o.Items).AsQueryable();
            if (!asAdmin) q = q.Where(o => o.UserId == userId);
            return await q.FirstOrDefaultAsync(o => o.Id == id, ct);
        }

        public async Task<(IReadOnlyList<Order> items, int total)> ListForUserAsync(int userId, bool asAdmin, int page, int pageSize, CancellationToken ct = default)
        {
            var q = _db.Orders.Include(o => o.Items).AsQueryable();
            if (!asAdmin) q = q.Where(o => o.UserId == userId);

            var total = await q.CountAsync(ct);
            var items = await q.OrderByDescending(o => o.CreatedAt)
                               .Skip((page - 1) * pageSize)
                               .Take(pageSize)
                               .ToListAsync(ct);
            return (items, total);
        }
    }
}
