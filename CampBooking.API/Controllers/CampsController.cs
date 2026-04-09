using CampBooking.Application.DTOs;
using CampBooking.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CampBooking.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CampsController : ControllerBase
{
    private readonly ICampService _campService;

    public CampsController(ICampService campService)
    {
        _campService = campService;
    }

    // ✅ Add Camp (Admin)
    [HttpPost]
    public async Task<IActionResult> CreateCamp(CreateCampDto dto)
    {
        await _campService.CreateCamp(dto);
        return Ok("Camp added");
    }

    // ✅ Get Available Camps (User) WITH DYNAMIC PAGINATION
    [HttpGet]
    public async Task<IActionResult> GetCamps(
        [FromQuery] DateTime checkIn,
        [FromQuery] DateTime checkOut,
        [FromQuery] int? capacity,
        [FromQuery] int page = 1)
    {
        var result = await _campService.GetAvailableCamps(
            checkIn,
            checkOut,
            capacity,
            page

        );

        return Ok(result);
    }

    // 🔥 Get ALL Camps (Admin View)
    [HttpGet("all")]
    public async Task<IActionResult> GetAllCamps()
    {
        var result = await _campService.GetAllCamps();
        return Ok(result);
    }

    // 🔥 Delete Camp
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCamp(int id)
    {
        await _campService.DeleteCamp(id);
        return Ok("Camp deleted");
    }

    [HttpGet("{id}/details")]
    public async Task<IActionResult> GetCampDetails(int id)
    {
        var result = await _campService.GetCampDetails(id);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCamp(int id, CreateCampDto dto)
    {
        await _campService.UpdateCamp(id, dto);
        return Ok("Camp updated");
    }
} 