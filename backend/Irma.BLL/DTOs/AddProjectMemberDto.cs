using Irma.DAL.Enums;

namespace Irma.BLL.DTOs;

public class AddProjectMemberDto
{
    public Guid UserId { get; set; }
    public ProjectRole Role { get; set; }
}
