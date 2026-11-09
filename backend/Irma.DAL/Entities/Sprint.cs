using Irma.DAL.Enums;

namespace Irma.DAL.Entities;

public class Sprint
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Goal { get; set; }
    public DateTimeOffset? StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }
    public SprintStatus Status { get; set; }

    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public ICollection<Issue> Issues { get; set; } = new List<Issue>();
}
