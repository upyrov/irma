using FluentValidation;
using Irma.BLL.DTOs;

namespace Irma.BLL.Validators;

public class TeamCreateDtoValidator : AbstractValidator<TeamCreateDto>
{
    public TeamCreateDtoValidator()
    {
        RuleFor(x => x.Name)
            .Must(name => !string.IsNullOrWhiteSpace(name))
            .WithMessage("Team name is required.")
            .MaximumLength(TeamCreateDto.NameMaxLength)
            .WithMessage($"Team name must not exceed {TeamCreateDto.NameMaxLength} characters.");
    }
}
