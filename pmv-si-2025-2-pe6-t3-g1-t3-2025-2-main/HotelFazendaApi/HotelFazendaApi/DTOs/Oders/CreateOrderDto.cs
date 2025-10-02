namespace HotelFazendaApi.DTOs.Orders
{
    public class CreateOrderDto
    {
        public string PaymentMethod { get; set; } = "room_charge";
        public string? Note { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }

    public class OrderItemDto
    {
        public string Sku { get; set; } = null!;
        public string Name { get; set; } = null!;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}
