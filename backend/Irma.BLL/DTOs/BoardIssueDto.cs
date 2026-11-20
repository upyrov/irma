using Irma.DAL.Enums;

namespace Irma.BLL.DTOs;

public class BoardIssueDto
{
    public Guid Id { get; set; }
    public string IssueKey { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public Priority Priority { get; set; }
    public int? StoryPoints { get; set; }
    public Guid StageId { get; set; }
    public UserDto? Assignee { get; set; }
}
