namespace CampBooking.Application.DTOs;

public class BookingResponseDto
{
    public string BookingReference { get; set; }

    public string CampName { get; set; }

    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }

    public int Guests { get; set; }
    public decimal TotalAmount { get; set; }

    // Billing info
    public string BillingAddress { get; set; }
    public string State { get; set; }
    public string Country { get; set; }
    public string ZipCode { get; set; }
    public string CellPhone { get; set; }
}