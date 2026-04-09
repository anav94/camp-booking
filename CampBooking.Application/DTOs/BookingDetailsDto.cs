namespace CampBooking.Application.DTOs;

public class BookingDetailsDto
{
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public int Guests { get; set; }
    public string Phone { get; set; }
    public string Status { get; set; }
}