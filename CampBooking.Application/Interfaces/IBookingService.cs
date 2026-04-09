using CampBooking.Application.DTOs;

namespace CampBooking.Application.Interfaces;

public interface IBookingService
{
    Task<BookingResponseDto> CreateBooking(CreateBookingDto dto);
    Task<BookingResponseDto> GetBooking(string bookingReference);
    Task CancelBooking(string bookingReference);
    Task AddRating(RatingDto dto);
    Task<decimal> CalculatePrice(CreateBookingDto dto);
    Task<bool> IsCampBooked(int campId, DateTime checkIn, DateTime checkOut);
    Task<List<BookingResponseDto>> GetBookingsByCampId(int campId);
    Task<object> PreviewPrice(CreateBookingDto dto);
}