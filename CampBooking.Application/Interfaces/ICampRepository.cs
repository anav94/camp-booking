using CampBooking.Domain.Entities;

public interface ICampRepository
{
    Task AddCamp(Camp camp);
    Task<List<Camp>> GetAllCampsWithBookings();
    Task<Camp?> GetCampById(int id);
    void DeleteCamp(Camp camp);

    // 🔥 ADD THIS
    Task<Camp> GetCampByIdWithBookings(int id);

    Task SaveChanges();
}