using CampBooking.API.Middlewares;
using CampBooking.Application.Interfaces;
using CampBooking.Application.Services;
using CampBooking.Application.Validators;
using CampBooking.Infrastructure.Data;
using CampBooking.Infrastructure.Repositories;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Services
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<ICampService, CampService>();
builder.Services.AddScoped<ICampRepository, CampRepository>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateBookingValidator>();
builder.Services.AddFluentValidationAutoValidation();


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();


app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

app.UseMiddleware<ExceptionMiddleware>();

app.MapControllers();

app.Run();