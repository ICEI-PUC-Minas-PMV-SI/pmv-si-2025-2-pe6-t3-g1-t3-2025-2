using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

using HotelFazendaApi.DTOs;
using HotelFazendaApi.Entities;
using HotelFazendaApi.Repositories.Interfaces;
using HotelFazendaApi.Services.Interfaces;

namespace HotelFazendaApi.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _repo;
        public OrderService(IOrderRepository repo) => _repo = repo;

        public async Task<IEnumerable<OrderReadDto>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return list.Select(MapToRead);
        }

        public async Task<OrderReadDto?> GetByIdAsync(int id)
        {
            var o = await _repo.GetByIdAsync(id);
            return o is null ? null : MapToRead(o);
        }

        public async Task<OrderReadDto> CreateAsync(OrderCreateDto dto)
        {
            if (dto.CheckOutDate <= dto.CheckInDate)
                throw new ArgumentException("CheckOutDate deve ser maior que CheckInDate.");

            var entity = new Order
            {
                CustomerName = dto.CustomerName,
                RoomId = dto.RoomId,
                CheckInDate = dto.CheckInDate,
                CheckOutDate = dto.CheckOutDate,
                Total = dto.Total,
                Status = OrderStatus.Pending
            };

            var created = await _repo.AddAsync(entity);
            return MapToRead(created);
        }

        public async Task<bool> UpdateAsync(int id, OrderUpdateDto dto)
        {
            var exists = await _repo.ExistsAsync(id);
            if (!exists) return false;

            var entity = new Order
            {
                Id = id,
                CustomerName = dto.CustomerName,
                RoomId = dto.RoomId,
                CheckInDate = dto.CheckInDate,
                CheckOutDate = dto.CheckOutDate,
                Status = dto.Status,
                Total = dto.Total
            };

            await _repo.UpdateAsync(entity);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var current = await _repo.GetByIdAsync(id);
            if (current is null) return false;

            await _repo.DeleteAsync(current);
            return true;
        }

        private static OrderReadDto MapToRead(Order o) => new()
        {
            Id = o.Id,
            CustomerName = o.CustomerName,
            RoomId = o.RoomId,
            CheckInDate = o.CheckInDate,
            CheckOutDate = o.CheckOutDate,
            Status = o.Status,
            Total = o.Total
        };
    }
}
