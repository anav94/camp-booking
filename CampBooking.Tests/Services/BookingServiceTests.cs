using CampBooking.Application.DTOs;
using CampBooking.Application.Interfaces;
using CampBooking.Application.Services;
using CampBooking.Domain.Entities;
using CampBooking.Domain.Enums;
using Moq;
using Xunit;

namespace CampBooking.Tests.Services;

public class BookingServiceTests
{
    private readonly Mock<IBookingRepository> _repoMock;
    private readonly BookingService _service;

    public BookingServiceTests()
    {
        _repoMock = new Mock<IBookingRepository>();
        _service = new BookingService(_repoMock.Object);
    }

    // ✅ Test 1 — Successful booking
    [Fact]
    public async Task CreateBooking_ShouldSucceed_WhenValid()
    {
        var dto = new CreateBookingDto
        {
            CampId = 1,
            CheckInDate = DateTime.Now.AddDays(2),
            CheckOutDate = DateTime.Now.AddDays(4),
            Guests = 2,
            BillingAddress = "Test",
            State = "Test",
            Country = "Test",
            ZipCode = "123",
            CellPhone = "999"
        };

        _repoMock.Setup(r => r.IsCampBooked(It.IsAny<int>(), It.IsAny<DateTime>(), It.IsAny<DateTime>()))
            .ReturnsAsync(false);

        _repoMock.Setup(r => r.GetCampById(It.IsAny<int>()))
            .ReturnsAsync(new Camp { Id = 1, Name = "Test Camp", RatePerNight = 1000 });

        var result = await _service.CreateBooking(dto);

        Assert.NotNull(result);
        Assert.Equal("Test Camp", result.CampName);
    }

    // ❌ Test 2 — Camp not found
    [Fact]
    public async Task CreateBooking_ShouldFail_WhenCampNotFound()
    {
        var dto = new CreateBookingDto { CampId = 1 };

        _repoMock.Setup(r => r.IsCampBooked(It.IsAny<int>(), It.IsAny<DateTime>(), It.IsAny<DateTime>()))
            .ReturnsAsync(false);

        _repoMock.Setup(r => r.GetCampById(It.IsAny<int>()))
            .ReturnsAsync((Camp)null);

        await Assert.ThrowsAsync<Exception>(() => _service.CreateBooking(dto));
    }

    // ❌ Test 3 — Overlapping booking
    [Fact]
    public async Task CreateBooking_ShouldFail_WhenCampAlreadyBooked()
    {
        var dto = new CreateBookingDto { CampId = 1 };

        _repoMock.Setup(r => r.IsCampBooked(It.IsAny<int>(), It.IsAny<DateTime>(), It.IsAny<DateTime>()))
            .ReturnsAsync(true);

        await Assert.ThrowsAsync<Exception>(() => _service.CreateBooking(dto));
    }

    // ❌ Test 4 — Cancel past booking
    [Fact]
    public async Task CancelBooking_ShouldFail_WhenPastBooking()
    {
        var booking = new Booking
        {
            BookingReference = "ABC",
            CheckInDate = DateTime.UtcNow.AddDays(-1)
        };

        _repoMock.Setup(r => r.GetBookingByReference("ABC"))
            .ReturnsAsync(booking);

        await Assert.ThrowsAsync<Exception>(() => _service.CancelBooking("ABC"));
    }

    // ✅ Test 5 — Rating allowed
    [Fact]
    public async Task AddRating_ShouldSucceed_WhenValid()
    {
        var booking = new Booking
        {
            Id = 1,
            BookingReference = "ABC",
            CheckOutDate = DateTime.UtcNow.AddDays(-1),
            Rating = null
        };

        _repoMock.Setup(r => r.GetBookingByReference("ABC"))
            .ReturnsAsync(booking);

        var dto = new RatingDto
        {
            BookingReference = "ABC",
            Score = 5
        };

        await _service.AddRating(dto);

        Assert.NotNull(booking.Rating);
        Assert.Equal(5, booking.Rating.Score);
    }
}