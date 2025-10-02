namespace HotelFazendaApi.Entities
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }     // FK -> Order
        public Order? Order { get; set; }
        public string Sku { get; set; } = null!;
        public string Name { get; set; } = null!;
        public int Quantity { get; set; }    // >= 1
        public decimal UnitPrice { get; set; } // >= 0
        public decimal LineTotal { get; set; } // Quantity * UnitPrice
    }
}
