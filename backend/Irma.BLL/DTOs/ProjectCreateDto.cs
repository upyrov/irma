using Irma.DAL.Enums;

namespace Irma.BLL.DTOs;

public class ProjectCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public Guid TeamId { get; set; }
    public ProjectTemplate Template { get; set; }
}
