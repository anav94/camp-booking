using CampBooking.Domain.Entities;

namespace CampBooking.Application.Interfaces;

public interface IBookingRepository
{
    Task<bool> IsCampBooked(int campId, DateTime checkIn, DateTime checkOut);
    Task<Camp?> GetCampById(int campId);
    Task AddBooking(Booking booking);
    Task<Booking?> GetBookingByReference(string reference);

    void DeleteBooking(Booking booking);

    Task<Coupon?> GetCouponByCode(string code);

    Task<List<Booking>> GetBookingsByCampId(int campId);
    Task SaveChanges();
}