using Irma.DAL.Enums;

namespace Irma.BLL.DTOs;

public class ProjectMemberDto
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public ProjectRole Role { get; set; }
}
