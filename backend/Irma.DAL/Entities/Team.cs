namespace Irma.DAL.Entities;

public class Team
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;

    public ICollection<User> Members { get; set; } = new List<User>();
    public ICollection<Project> Projects { get; set; } = new List<Project>();
}
