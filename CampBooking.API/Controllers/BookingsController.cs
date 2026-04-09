using CampBooking.Application.DTOs;
using CampBooking.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CampBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    // ✅ Create Booking
    [HttpPost]
    public async Task<IActionResult> CreateBooking(CreateBookingDto dto)
    {
        try
        {
            var result = await _bookingService.CreateBooking(dto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // ✅ Get Booking
    [HttpGet("{reference}")]
    public async Task<IActionResult> GetBooking(string reference)
    {
        try
        {
            var result = await _bookingService.GetBooking(reference);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    // ✅ Cancel Booking
    [HttpPost("cancel")]
    public async Task<IActionResult> CancelBooking([FromQuery] string reference)
    {
        try
        {
            await _bookingService.CancelBooking(reference);
            return Ok("Booking cancelled");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // ✅ Add Rating
    [HttpPost("rate")]
    public async Task<IActionResult> AddRating(RatingDto dto)
    {
        try
        {
            await _bookingService.AddRating(dto);
            return Ok("Rating submitted");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // ✅ Price Preview
    [HttpPost("preview")]
    public async Task<IActionResult> PreviewPrice(CreateBookingDto dto)
    {
        var result = await _bookingService.PreviewPrice(dto);
        return Ok(result);
    }

    // ✅ Check Availability
    [HttpGet("check-availability")]
    public async Task<IActionResult> CheckAvailability(int campId, DateTime checkIn, DateTime checkOut)
    {
        var isBooked = await _bookingService.IsCampBooked(campId, checkIn, checkOut);
        return Ok(!isBooked);
    }

    // 🔥 NEW: Get bookings by camp
    [HttpGet("camp/{campId}")]
    public async Task<IActionResult> GetBookingsByCamp(int campId)
    {
        try
        {
            var bookings = await _bookingService.GetBookingsByCampId(campId);
            return Ok(bookings);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}