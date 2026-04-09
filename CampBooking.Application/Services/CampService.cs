using CampBooking.Application.DTOs;
using CampBooking.Application.Interfaces;
using CampBooking.Domain.Entities;
using CampBooking.Domain.Enums;

namespace CampBooking.Application.Services;

public class CampService : ICampService
{
    private readonly ICampRepository _repo;

    public CampService(ICampRepository repo)
    {
        _repo = repo;
    }

    public async Task CreateCamp(CreateCampDto dto)
    {
        var camp = new Camp
        {
            Name = dto.Name,
            RatePerNight = dto.RatePerNight,
            Capacity = dto.Capacity,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl
        };

        await _repo.AddCamp(camp);
        await _repo.SaveChanges();
    }

    public async Task<List<CampResponseDto>> GetAllCamps()
    {
        var camps = await _repo.GetAllCampsWithBookings();

        return camps.Select(c =>
        {
            var ratings = c.Bookings
                .Where(b => b.Rating != null)
                .Select(b => b.Rating.Score)
                .ToList();

            return new CampResponseDto
            {
                Id = c.Id,
                Name = c.Name,
                RatePerNight = c.RatePerNight,
                Capacity = c.Capacity,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                AverageRating = ratings.Any() ? ratings.Average() : 0,
                RatingCount = ratings.Count
            };
        }).ToList();
    }

    public async Task DeleteCamp(int id)
    {
        var camp = await _repo.GetCampById(id);
        if (camp == null) throw new Exception("Camp not found");

        _repo.DeleteCamp(camp);
        await _repo.SaveChanges();
    }

    // ✅ FIXED AVAILABILITY LOGIC
    public async Task<List<CampResponseDto>> GetAvailableCamps(
        DateTime checkIn,
        DateTime checkOut,
        int? capacity,
        int page)
    {
        if (checkIn.Date >= checkOut.Date)
        {
            throw new Exception("Check-out date must be after check-in date");
        }

        var camps = await _repo.GetAllCampsWithBookings();

        // 🔍 Filter availability
        var availableCamps = camps.Where(c =>
            !c.Bookings.Any(b =>
                // Filter out any booking that isn't cancelled
                b.Status != BookingStatus.Cancelled &&
                // Overlap check using .Date to ignore time-of-day discrepancies
                b.CheckInDate.Date < checkOut.Date &&
                b.CheckOutDate.Date > checkIn.Date
            )
        );

        // 👥 Capacity filter
        if (capacity.HasValue)
        {
            availableCamps = availableCamps.Where(c => c.Capacity >= capacity.Value);
        }

        // ⭐ Map to DTO and calculate ratings
        var result = availableCamps.Select(c =>
        {
            var ratings = c.Bookings
                .Where(b => b.Rating != null)
                .Select(b => b.Rating.Score)
                .ToList();

            return new CampResponseDto
            {
                Id = c.Id,
                Name = c.Name,
                RatePerNight = c.RatePerNight,
                Capacity = c.Capacity,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                AverageRating = ratings.Any() ? ratings.Average() : 0,
                RatingCount = ratings.Count
            };
        });

        int pageSize = 3;
        return result
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();
    }

    public async Task<CampDetailsDto> GetCampDetails(int id)
    {
        var camp = await _repo.GetCampByIdWithBookings(id);
        if (camp == null) throw new Exception("Camp not found");

        return new CampDetailsDto
        {
            Id = camp.Id,
            Name = camp.Name,
            Capacity = camp.Capacity,
            RatePerNight = camp.RatePerNight,
            Description = camp.Description,
            ImageUrl = camp.ImageUrl,
            Bookings = camp.Bookings.Select(b => new BookingDetailsDto
            {
                CheckInDate = b.CheckInDate,
                CheckOutDate = b.CheckOutDate,
                Guests = b.Guests,
                Phone = b.CellPhone,
                Status = b.Status.ToString()
            }).ToList()
        };
    }

    public async Task UpdateCamp(int id, CreateCampDto dto)
    {
        var camp = await _repo.GetCampById(id);
        if (camp == null) throw new Exception("Camp not found");

        camp.Name = dto.Name;
        camp.Capacity = dto.Capacity;
        camp.RatePerNight = dto.RatePerNight;
        camp.Description = dto.Description;
        camp.ImageUrl = dto.ImageUrl;

        await _repo.SaveChanges();
    }
}