using Microsoft.EntityFrameworkCore;
using CampBooking.Domain.Entities;

namespace CampBooking.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Camp> Camps { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<Rating> Ratings { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Coupon> Coupons { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Booking → Camp (Many-to-One)
        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Camp)
            .WithMany(c => c.Bookings)
            .HasForeignKey(b => b.CampId);

        // Booking → Rating (One-to-One)
        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Rating)
            .WithOne(r => r.Booking)
            .HasForeignKey<Rating>(r => r.BookingId);

        // Unique Booking Reference
        modelBuilder.Entity<Booking>()
            .HasIndex(b => b.BookingReference)
            .IsUnique();
    }
}