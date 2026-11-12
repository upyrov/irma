using FluentValidation;
using Irma.BLL.DTOs;

namespace Irma.BLL.Validators;

public class IssueCreateDtoValidator : AbstractValidator<IssueCreateDto>
{
    public IssueCreateDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Issue title is required.")
            .MaximumLength(200)
            .WithMessage("Issue title must not exceed 200 characters.");

        RuleFor(x => x.StageId)
            .NotEmpty()
            .WithMessage("StageId is required.");

        RuleFor(x => x.Description)
            .MaximumLength(4000)
            .WithMessage("Description must not exceed 4000 characters.")
            .When(x => !string.IsNullOrWhiteSpace(x.Description));

        RuleFor(x => x.StoryPoints)
            .InclusiveBetween(1, 100)
            .WithMessage("Story points must be between 1 and 100.")
            .When(x => x.StoryPoints.HasValue);
    }
}
