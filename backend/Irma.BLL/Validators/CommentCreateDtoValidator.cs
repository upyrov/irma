using FluentValidation;
using Irma.BLL.DTOs;

namespace Irma.BLL.Validators;

public class CommentCreateDtoValidator : AbstractValidator<CommentCreateDto>
{
    public CommentCreateDtoValidator()
    {
        RuleFor(x => x.Text)
            .NotEmpty()
            .WithMessage("Comment text is required.")
            .MaximumLength(2000)
            .WithMessage("Comment text must not exceed 2000 characters.");
    }
}
