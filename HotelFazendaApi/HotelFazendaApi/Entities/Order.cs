using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HotelFazendaApi.Entities
{
    public enum OrderStatus { Pending = 0, Confirmed = 1, Canceled = 2 }

    public class Order
    {
        [Key] public int Id { get; set; }
        [Required, MaxLength(120)] public string CustomerName { get; set; } = string.Empty;
        [Required] public int RoomId { get; set; }
        [Required] public DateTime CheckInDate { get; set; }
        [Required] public DateTime CheckOutDate { get; set; }
        [Required] public OrderStatus Status { get; set; } = OrderStatus.Pending;
        [Column(TypeName = "decimal(10,2)")] public decimal Total { get; set; }

        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
