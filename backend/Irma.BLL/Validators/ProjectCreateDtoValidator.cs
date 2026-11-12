using FluentValidation;
using Irma.BLL.DTOs;

namespace Irma.BLL.Validators;

public class ProjectCreateDtoValidator : AbstractValidator<ProjectCreateDto>
{
    public ProjectCreateDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Project name is required.")
            .MaximumLength(100)
            .WithMessage("Project name must not exceed 100 characters.");

        RuleFor(x => x.TeamId)
            .NotEmpty()
            .WithMessage("TeamId is required.");
    }
}
