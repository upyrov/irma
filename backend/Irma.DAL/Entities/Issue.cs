using Irma.DAL.Enums;

namespace Irma.DAL.Entities;

public class Issue
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string IssueKey { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public IssueType IssueType { get; set; }
    public Priority Priority { get; set; }
    public int? StoryPoints { get; set; }

    public Guid? AssigneeId { get; set; }
    public Guid ProjectId { get; set; }
    public Guid StageId { get; set; }
    public Guid? SprintId { get; set; }
    public Guid? EpicId { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public User? Assignee { get; set; }
    public Project Project { get; set; } = null!;
    public Stage Stage { get; set; } = null!;
    public Sprint? Sprint { get; set; }
    public Issue? Epic { get; set; }
    public ICollection<Issue> SubIssues { get; set; } = new List<Issue>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
