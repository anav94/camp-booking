using Microsoft.AspNetCore.Mvc;
using CampBooking.Domain.Entities;
using CampBooking.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CampBooking.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CouponsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CouponsController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ CREATE COUPON (ADMIN)
        [HttpPost]
        public async Task<IActionResult> CreateCoupon(Coupon coupon)
        {
            _context.Coupons.Add(coupon);
            await _context.SaveChangesAsync();

            return Ok(coupon);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCoupon(int id, Coupon updated)
        {
            var coupon = await _context.Coupons.FindAsync(id);
            if (coupon == null)
                return NotFound();

            coupon.Code = updated.Code;
            coupon.DiscountPercentage = updated.DiscountPercentage;
            coupon.MinNights = updated.MinNights;

            await _context.SaveChangesAsync();

            return Ok(coupon);
        }

        // ✅ GET COUPON BY CODE (used in booking)
        [HttpGet("{code}")]
        public async Task<IActionResult> GetCoupon(string code)
        {
            var coupon = await _context.Coupons
                .FirstOrDefaultAsync(c => c.Code == code);

            if (coupon == null)
                return NotFound();

            return Ok(coupon);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCoupons()
        {
            var coupons = await _context.Coupons.ToListAsync();
            return Ok(coupons);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoupon(int id)
        {
            var coupon = await _context.Coupons.FindAsync(id);
            if (coupon == null)
                return NotFound();

            _context.Coupons.Remove(coupon);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}