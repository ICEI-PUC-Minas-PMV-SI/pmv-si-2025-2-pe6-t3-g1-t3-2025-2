using HotelFazendaApi.DTOs.Orders;

namespace HotelFazendaApi.Services.Interfaces
{
    public interface IOrderService
    {
        Task<OrderViewDto> CreateAsync(int userId, CreateOrderDto dto, CancellationToken ct = default);
        Task<OrderViewDto?> GetByIdForUserAsync(int userId, int id, bool asAdmin, CancellationToken ct = default);
        Task<object> ListAsync(int userId, int page, int pageSize, bool me, bool asAdmin, CancellationToken ct = default);
    }
}
