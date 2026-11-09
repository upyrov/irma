using Irma.DAL.Enums;

namespace Irma.BLL.DTOs;

public class IssueUpdateDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public Priority? Priority { get; set; }
    public int? StoryPoints { get; set; }
    public Guid? AssigneeId { get; set; }
    public Guid? StageId { get; set; }
    public Guid? SprintId { get; set; }
    public Guid? EpicId { get; set; }
}
