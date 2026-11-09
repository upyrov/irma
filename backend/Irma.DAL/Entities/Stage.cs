namespace Irma.DAL.Entities;

public class Stage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public int Order { get; set; }

    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public ICollection<Issue> Issues { get; set; } = new List<Issue>();
}
