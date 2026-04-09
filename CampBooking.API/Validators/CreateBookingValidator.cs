using CampBooking.Application.DTOs;
using FluentValidation;

namespace CampBooking.Application.Validators;

public class CreateBookingValidator : AbstractValidator<CreateBookingDto>
{
    public CreateBookingValidator()
    {
        RuleFor(x => x.CampId)
            .GreaterThan(0).WithMessage("CampId must be valid");

        RuleFor(x => x.Guests)
            .GreaterThan(0).WithMessage("Guests must be at least 1");

        RuleFor(x => x.CheckInDate)
            .LessThan(x => x.CheckOutDate)
            .WithMessage("Check-out must be after check-in");

        RuleFor(x => x.BillingAddress)
            .NotEmpty().WithMessage("Billing address required");

        RuleFor(x => x.State)
            .NotEmpty().WithMessage("State required");

        RuleFor(x => x.Country)
            .NotEmpty().WithMessage("Country required");

        RuleFor(x => x.ZipCode)
            .NotEmpty().WithMessage("Zip code required");

        RuleFor(x => x.CellPhone)
            .NotEmpty().WithMessage("Phone required");
    }
}