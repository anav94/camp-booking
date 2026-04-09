using CampBooking.Application.Interfaces;
using CampBooking.Domain.Entities;
using CampBooking.Domain.Enums;
using CampBooking.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CampBooking.Infrastructure.Repositories;

public class BookingRepository : IBookingRepository
{
    private readonly AppDbContext _context;

    public BookingRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> IsCampBooked(int campId, DateTime checkIn, DateTime checkOut)
    {
        return await _context.Bookings.AnyAsync(b =>
            b.CampId == campId &&
            checkIn < b.CheckOutDate &&
            checkOut > b.CheckInDate
        );
    }

    public async Task<Camp?> GetCampById(int campId)
    {
        return await _context.Camps.FindAsync(campId);
    }

    public async Task AddBooking(Booking booking)
    {
        await _context.Bookings.AddAsync(booking);
    }

    public async Task<Booking?> GetBookingByReference(string reference)
    {
        if (string.IsNullOrWhiteSpace(reference))
            return null;

        var cleanRef = reference.Trim().ToLower();

        return await _context.Bookings
            .Include(b => b.Camp)
            .Include(b => b.Rating)
            .FirstOrDefaultAsync(b =>
                b.BookingReference.ToLower() == cleanRef
            );
    }

    public void DeleteBooking(Booking booking)
    {
        _context.Bookings.Remove(booking);
    }

    public async Task<Coupon?> GetCouponByCode(string code)
    {
        return await _context.Coupons
            .FirstOrDefaultAsync(c => c.Code == code);
    }

    // 🔥 NEW METHOD (IMPORTANT)
    public async Task<List<Booking>> GetBookingsByCampId(int campId)
    {
        return await _context.Bookings
            .Where(b => b.CampId == campId)
            .Include(b => b.Camp) // needed for CampName
            .ToListAsync();
    }

    public async Task SaveChanges()
    {
        await _context.SaveChangesAsync();
    }
}