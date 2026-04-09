namespace CampBooking.Domain.Entities;

public class Camp
{
    public int Id { get; set; }

    public string Name { get; set; }
    public decimal RatePerNight { get; set; }
    public int Capacity { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }

    // Navigation
    public ICollection<Booking> Bookings { get; set; }
}