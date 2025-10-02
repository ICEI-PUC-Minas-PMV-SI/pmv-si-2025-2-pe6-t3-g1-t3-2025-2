namespace HotelFazendaApi.DTOs.Orders
{
    public class OrderViewDto
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Status { get; set; } = null!;
        public string PaymentMethod { get; set; } = null!;
        public string? Note { get; set; }
        public decimal TotalAmount { get; set; }
        public List<OrderItemViewDto> Items { get; set; } = new();
    }

    public class OrderItemViewDto
    {
        public int Id { get; set; }
        public string Sku { get; set; } = null!;
        public string Name { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal LineTotal { get; set; }
    }
}
