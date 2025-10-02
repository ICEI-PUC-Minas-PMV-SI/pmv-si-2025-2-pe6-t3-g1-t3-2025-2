using HotelFazendaApi.Entities;

namespace HotelFazendaApi.Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order> AddAsync(Order order, CancellationToken ct = default);
        Task<Order?> GetForUserAsync(int id, int userId, bool asAdmin, CancellationToken ct = default);
        Task<(IReadOnlyList<Order> items, int total)> ListForUserAsync(int userId, bool asAdmin, int page, int pageSize, CancellationToken ct = default);
    }
}
