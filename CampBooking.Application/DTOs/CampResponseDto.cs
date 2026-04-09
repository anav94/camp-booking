namespace CampBooking.Application.DTOs;

public class CampResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal RatePerNight { get; set; }
    public int Capacity { get; set; }
    public string Description { get; set; }
    public string ImageUrl { get; set; }

    // ⭐ IMPORTANT (you pointed this out correctly)
    public double AverageRating { get; set; }
    public int RatingCount { get; set; }
}