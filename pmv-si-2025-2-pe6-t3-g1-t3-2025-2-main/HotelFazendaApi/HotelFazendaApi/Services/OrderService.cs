using HotelFazendaApi.DTOs.Orders;
using HotelFazendaApi.Entities;
using HotelFazendaApi.Repositories.Interfaces;

namespace HotelFazendaApi.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _repo;
        public OrderService(IOrderRepository repo) => _repo = repo;

        public async Task<OrderViewDto> CreateAsync(int userId, CreateOrderDto dto, CancellationToken ct = default)
        {
            if (dto.Items == null || dto.Items.Count == 0)
                throw new ArgumentException("Pedido deve conter pelo menos 1 item.");
            if (dto.Items.Any(i => i.Quantity < 1 || i.UnitPrice < 0))
                throw new ArgumentException("Quantidade deve ser >= 1 e preço >= 0.");

            var order = new Order
            {
                UserId = userId,
                PaymentMethod = dto.PaymentMethod,
                Note = dto.Note,
                Status = "pending",
                Items = dto.Items.Select(i => new OrderItem
                {
                    Sku = i.Sku,
                    Name = i.Name,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    LineTotal = i.Quantity * i.UnitPrice
                }).ToList()
            };
            order.TotalAmount = order.Items.Sum(x => x.LineTotal);

            var created = await _repo.AddAsync(order, ct);
            return MapToView(created);
        }

        public async Task<OrderViewDto?> GetByIdForUserAsync(int userId, int id, bool asAdmin, CancellationToken ct = default)
        {
            var order = await _repo.GetForUserAsync(id, userId, asAdmin, ct);
            return order is null ? null : MapToView(order);
        }

        public async Task<object> ListAsync(int userId, int page, int pageSize, bool me, bool asAdmin, CancellationToken ct = default)
        {
            var (items, total) = await _repo.ListForUserAsync(userId, asAdmin, page, pageSize, ct);
            return new { items = items.Select(MapToView), page, pageSize, total };
        }

        private static OrderViewDto MapToView(Order o) => new()
        {
            Id = o.Id,
            CreatedAt = o.CreatedAt,
            Status = o.Status,
            PaymentMethod = o.PaymentMethod,
            Note = o.Note,
            TotalAmount = o.TotalAmount,
            Items = o.Items.Select(i => new OrderItemViewDto
            {
                Id = i.Id,
                Sku = i.Sku,
                Name = i.Name,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                LineTotal = i.LineTotal
            }).ToList()
        };
    }
}
