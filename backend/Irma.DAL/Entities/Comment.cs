namespace Irma.DAL.Entities;

public class Comment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Text { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public Guid AuthorId { get; set; }
    public Guid IssueId { get; set; }

    public User Author { get; set; } = null!;
    public Issue Issue { get; set; } = null!;
}
