using CampBooking.Domain.Enums;

namespace CampBooking.Domain.Entities;

public class Booking
{
    public int Id { get; set; }

    public int CampId { get; set; }
    public Camp Camp { get; set; }

    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }

    public int Guests { get; set; }
    public decimal TotalAmount { get; set; }

    public string BookingReference { get; set; }

    // Billing fields
    public string BillingAddress { get; set; }
    public string State { get; set; }
    public string Country { get; set; }
    public string ZipCode { get; set; }
    public string CellPhone { get; set; }

    public BookingStatus Status { get; set; }

    // Navigation
    public Rating Rating { get; set; }
}