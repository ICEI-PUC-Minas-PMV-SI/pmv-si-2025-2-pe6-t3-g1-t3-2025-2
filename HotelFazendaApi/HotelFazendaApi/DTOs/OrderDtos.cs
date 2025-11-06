using System.ComponentModel.DataAnnotations;
using HotelFazendaApi.Entities;

namespace HotelFazendaApi.DTOs
{
    public class OrderCreateDto
    {
        [Required, MaxLength(120)]
        public string CustomerName { get; set; } = string.Empty;
        [Required] public DateTime CheckInDate { get; set; }
        [Required] public DateTime CheckOutDate { get; set; }
        public decimal Total { get; set; }
    }

    public class OrderUpdateDto
    {
        [Required, MaxLength(120)]
        public string CustomerName { get; set; } = string.Empty;
        [Required] public DateTime CheckInDate { get; set; }
        [Required] public DateTime CheckOutDate { get; set; }
        [Required] public OrderStatus Status { get; set; }
        public decimal Total { get; set; }
    }

    public class OrderReadDto
    {
        public int Id { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public OrderStatus Status { get; set; }
        public decimal Total { get; set; }
    }
}
