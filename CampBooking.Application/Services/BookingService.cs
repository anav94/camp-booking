using CampBooking.Application.DTOs;
using CampBooking.Application.Interfaces;
using CampBooking.Domain.Entities;
using CampBooking.Domain.Enums;
using System.Linq;

namespace CampBooking.Application.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _repo;

    public BookingService(IBookingRepository repo)
    {
        _repo = repo;
    }

    // ✅ CREATE BOOKING
    public async Task<BookingResponseDto> CreateBooking(CreateBookingDto dto)
    {
        var isBooked = await _repo.IsCampBooked(dto.CampId, dto.CheckInDate, dto.CheckOutDate);

        if (isBooked)
            throw new Exception("Camp not available");

        var camp = await _repo.GetCampById(dto.CampId);

        if (camp == null)
            throw new Exception("Camp not found");

        var total = await CalculatePrice(dto);
        var reference = GenerateBookingReference();

        var booking = new Booking
        {
            CampId = dto.CampId,
            CheckInDate = dto.CheckInDate,
            CheckOutDate = dto.CheckOutDate,
            Guests = dto.Guests,
            TotalAmount = total,
            BookingReference = reference,

            // ✅ Status added here to ensure search works correctly
            Status = BookingStatus.Confirmed,

            BillingAddress = dto.BillingAddress,
            State = dto.State,
            Country = dto.Country,
            ZipCode = dto.ZipCode,
            CellPhone = dto.CellPhone
        };

        await _repo.AddBooking(booking);
        await _repo.SaveChanges();

        return new BookingResponseDto
        {
            BookingReference = reference,
            CampName = camp.Name,
            CheckInDate = booking.CheckInDate,
            CheckOutDate = booking.CheckOutDate,
            Guests = booking.Guests,
            TotalAmount = booking.TotalAmount,
            BillingAddress = booking.BillingAddress,
            State = booking.State,
            Country = booking.Country,
            ZipCode = booking.ZipCode,
            CellPhone = booking.CellPhone
        };
    }

    // ✅ PRICE CALCULATION
    public async Task<decimal> CalculatePrice(CreateBookingDto dto)
    {
        var camp = await _repo.GetCampById(dto.CampId);

        if (camp == null)
            throw new Exception("Camp not found");

        var nights = (dto.CheckOutDate - dto.CheckInDate).Days;
        decimal total = 0;

        for (var date = dto.CheckInDate; date < dto.CheckOutDate; date = date.AddDays(1))
        {
            var isWeekend = date.DayOfWeek == DayOfWeek.Friday ||
                            date.DayOfWeek == DayOfWeek.Saturday ||
                            date.DayOfWeek == DayOfWeek.Sunday;

            var price = isWeekend
                ? camp.RatePerNight
                : camp.RatePerNight * 0.8m;

            total += price;
        }

        if (!string.IsNullOrEmpty(dto.CouponCode))
        {
            var coupon = await _repo.GetCouponByCode(dto.CouponCode);
            if (coupon != null && nights >= coupon.MinNights)
            {
                total -= (total * coupon.DiscountPercentage / 100);
            }
        }

        if (total < 0) total = 0;
        return total;
    }

    // ✅ PREVIEW PRICE (RESTORED)
    public async Task<object> PreviewPrice(CreateBookingDto dto)
    {
        var camp = await _repo.GetCampById(dto.CampId);

        if (camp == null)
            throw new Exception("Camp not found");

        var nights = (dto.CheckOutDate - dto.CheckInDate).Days;
        decimal total = 0;

        for (var date = dto.CheckInDate; date < dto.CheckOutDate; date = date.AddDays(1))
        {
            var isWeekend = date.DayOfWeek == DayOfWeek.Friday ||
                            date.DayOfWeek == DayOfWeek.Saturday ||
                            date.DayOfWeek == DayOfWeek.Sunday;

            var price = isWeekend
                ? camp.RatePerNight
                : camp.RatePerNight * 0.8m;

            total += price;
        }

        decimal originalPrice = total;
        bool discountApplied = false;

        if (!string.IsNullOrEmpty(dto.CouponCode))
        {
            var coupon = await _repo.GetCouponByCode(dto.CouponCode);
            if (coupon != null && nights >= coupon.MinNights)
            {
                var discount = total * coupon.DiscountPercentage / 100;
                total -= discount;
                discountApplied = true;
            }
        }

        if (total < 0) total = 0;

        return new
        {
            originalPrice,
            finalPrice = total,
            discountApplied
        };
    }

    public async Task<bool> IsCampBooked(int campId, DateTime checkIn, DateTime checkOut)
    {
        return await _repo.IsCampBooked(campId, checkIn, checkOut);
    }

    private string GenerateBookingReference()
    {
        return Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper();
    }

    public async Task<BookingResponseDto> GetBooking(string bookingReference)
    {
        var booking = await _repo.GetBookingByReference(bookingReference);
        if (booking == null) throw new Exception("Booking not found");

        return new BookingResponseDto
        {
            BookingReference = booking.BookingReference,
            CampName = booking.Camp.Name,
            CheckInDate = booking.CheckInDate,
            CheckOutDate = booking.CheckOutDate,
            Guests = booking.Guests,
            TotalAmount = booking.TotalAmount,
            BillingAddress = booking.BillingAddress,
            State = booking.State,
            Country = booking.Country,
            ZipCode = booking.ZipCode,
            CellPhone = booking.CellPhone
        };
    }

    public async Task CancelBooking(string bookingReference)
    {
        var booking = await _repo.GetBookingByReference(bookingReference);
        if (booking == null) throw new Exception("Booking not found");

        _repo.DeleteBooking(booking);
        await _repo.SaveChanges();
    }

    public async Task AddRating(RatingDto dto)
    {
        var booking = await _repo.GetBookingByReference(dto.BookingReference);
        if (booking == null) throw new Exception("Booking not found");

        if (booking.CheckOutDate > DateTime.UtcNow)
            throw new Exception("Rating allowed only after stay");

        if (booking.Rating != null)
        {
            booking.Rating.Score = dto.Score;
        }
        else
        {
            booking.Rating = new Rating
            {
                BookingId = booking.Id,
                Score = dto.Score
            };
        }

        await _repo.SaveChanges();
    }

    public async Task<List<BookingResponseDto>> GetBookingsByCampId(int campId)
    {
        var bookings = await _repo.GetBookingsByCampId(campId);
        return bookings.Select(b => new BookingResponseDto
        {
            BookingReference = b.BookingReference,
            CampName = b.Camp?.Name,
            CheckInDate = b.CheckInDate,
            CheckOutDate = b.CheckOutDate,
            Guests = b.Guests,
            TotalAmount = b.TotalAmount
        }).ToList();
    }
}