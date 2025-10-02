namespace HotelFazendaApi.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public int UserId { get; set; }                  // FK -> Users
        public User? User { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "pending";  // pending|approved|rejected|fulfilled|canceled
        public string PaymentMethod { get; set; } = "room_charge"; // cash|card|room_charge
        public string? Note { get; set; }
        public decimal TotalAmount { get; set; }         // soma dos itens

        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    }
}
