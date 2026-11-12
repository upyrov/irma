using FluentValidation;
using Irma.BLL.DTOs;

namespace Irma.BLL.Validators;

public class SprintCreateDtoValidator : AbstractValidator<SprintCreateDto>
{
    public SprintCreateDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Sprint name is required.")
            .MaximumLength(100)
            .WithMessage("Sprint name must not exceed 100 characters.");

        RuleFor(x => x.ProjectId)
            .NotEmpty()
            .WithMessage("ProjectId is required.");

        RuleFor(x => x)
            .Must(x => !x.StartDate.HasValue || !x.EndDate.HasValue || x.EndDate >= x.StartDate)
            .WithMessage("EndDate must be greater than or equal to StartDate.");
    }
}
