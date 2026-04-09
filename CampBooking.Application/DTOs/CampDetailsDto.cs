public class CampDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Capacity { get; set; }
    public decimal RatePerNight { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }

    public List<BookingDetailsDto> Bookings { get; set; }
}

public class BookingDetailsDto
{
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public int Guests { get; set; }
    public string CustomerName { get; set; }
    public string Phone { get; set; }
    public string Status { get; set; }
}