using CampBooking.Application.Interfaces;
using CampBooking.Domain.Entities;
using CampBooking.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampBooking.Infrastructure.Repositories;

public class CampRepository : ICampRepository
{
    private readonly AppDbContext _context;

    public CampRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddCamp(Camp camp)
    {
        await _context.Camps.AddAsync(camp);
    }



    public async Task<List<Camp>> GetAllCampsWithBookings()
    {
        return await _context.Camps
            .Include(c => c.Bookings)
            .ThenInclude(b => b.Rating)
            .ToListAsync();
    }

    public async Task<Camp?> GetCampById(int id)
    {
        return await _context.Camps.FindAsync(id);
    }

    public void DeleteCamp(Camp camp)
    {
        _context.Camps.Remove(camp);
    }

    public async Task<Camp> GetCampByIdWithBookings(int id)
    {
        return await _context.Camps
            .Include(c => c.Bookings)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task SaveChanges()
    {
        await _context.SaveChangesAsync();
    }
}