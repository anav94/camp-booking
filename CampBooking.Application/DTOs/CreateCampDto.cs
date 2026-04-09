namespace CampBooking.Application.DTOs;

public class CreateCampDto
{
    public string Name { get; set; }
    public decimal RatePerNight { get; set; }
    public int Capacity { get; set; }
    public string Description { get; set; }

    // later we can switch to file upload
    public string ImageUrl { get; set; }
}