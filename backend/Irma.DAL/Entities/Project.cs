using Irma.DAL.Enums;

namespace Irma.DAL.Entities;

public class Project
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ProjectTemplate Template { get; set; }

    public Guid TeamId { get; set; }
    public Team Team { get; set; } = null!;

    public ICollection<ProjectMember> Members { get; set; } = new List<ProjectMember>();
    public ICollection<Sprint> Sprints { get; set; } = new List<Sprint>();
    public ICollection<Stage> Stages { get; set; } = new List<Stage>();
    public ICollection<Issue> Issues { get; set; } = new List<Issue>();
}
