using Irma.DAL.Enums;

namespace Irma.DAL.Entities;

public class ProjectMember
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProjectId { get; set; }
    public Guid UserId { get; set; }
    public ProjectRole Role { get; set; }

    public Project Project { get; set; } = null!;
    public User User { get; set; } = null!;
}
