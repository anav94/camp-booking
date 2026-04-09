using CampBooking.Application.DTOs;
using FluentValidation;

namespace CampBooking.Application.Validators;

public class CreateCampValidator : AbstractValidator<CreateCampDto>
{
    public CreateCampValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Camp name required");

        RuleFor(x => x.RatePerNight)
            .GreaterThan(0).WithMessage("Rate must be greater than 0");

        RuleFor(x => x.Capacity)
            .GreaterThan(0).WithMessage("Capacity must be at least 1");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Description required");

        RuleFor(x => x.ImageUrl)
            .NotEmpty().WithMessage("Image required");
    }
}