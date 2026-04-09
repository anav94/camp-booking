using CampBooking.Application.DTOs;

namespace CampBooking.Application.Interfaces;

public interface ICampService
{
    // ✅ Create
    Task CreateCamp(CreateCampDto dto);

    // ✅ Admin - get all camps (no pagination)
    Task<List<CampResponseDto>> GetAllCamps();

    // ✅ User - paginated default view (IMPORTANT 🔥)
    
    // ✅ User - filtered search
    Task<List<CampResponseDto>> GetAvailableCamps(
        DateTime checkIn,
        DateTime checkOut,
        int? capacity,
        int page
    );

    // ✅ Details
    Task<CampDetailsDto> GetCampDetails(int id);

    // ✅ Update
    Task UpdateCamp(int id, CreateCampDto dto);

    // ✅ Delete
    Task DeleteCamp(int id);
}