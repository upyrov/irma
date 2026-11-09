using Irma.DAL.Enums;

namespace Irma.BLL.DTOs;

public class IssueCreateDto
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public IssueType IssueType { get; set; }
    public Priority Priority { get; set; }
    public int? StoryPoints { get; set; }
    public Guid? AssigneeId { get; set; }
    public Guid StageId { get; set; }
    public Guid? SprintId { get; set; }
    public Guid? EpicId { get; set; }
}
