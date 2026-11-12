using FluentValidation;
using Irma.BLL.DTOs;

namespace Irma.BLL.Validators;

public class IssueUpdateDtoValidator : AbstractValidator<IssueUpdateDto>
{
    public IssueUpdateDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .WithMessage("Title cannot be empty.")
            .MaximumLength(200)
            .WithMessage("Title must not exceed 200 characters.")
            .When(x => x.Title is not null);

        RuleFor(x => x.Description)
            .MaximumLength(4000)
            .WithMessage("Description must not exceed 4000 characters.")
            .When(x => x.Description is not null);

        RuleFor(x => x.StageId)
            .NotEmpty()
            .WithMessage("StageId cannot be empty.")
            .When(x => x.StageId.HasValue);

        RuleFor(x => x.StoryPoints)
            .InclusiveBetween(1, 100)
            .WithMessage("Story points must be between 1 and 100.")
            .When(x => x.StoryPoints.HasValue);
    }
}
