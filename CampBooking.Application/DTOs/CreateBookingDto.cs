namespace CampBooking.Application.DTOs;

public class CreateBookingDto
{
    public int CampId { get; set; }

    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }

    public int Guests { get; set; }

    public string? CouponCode { get; set; }

    // Billing fields (FULLY correct)
    public string BillingAddress { get; set; }
    public string State { get; set; }
    public string Country { get; set; }
    public string ZipCode { get; set; }
    public string CellPhone { get; set; }
}