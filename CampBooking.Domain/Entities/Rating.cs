namespace CampBooking.Domain.Entities;

public class Rating
{
    public int Id { get; set; }

    public int BookingId { get; set; }
    public Booking Booking { get; set; }

    public int Score { get; set; } // 1–5
}