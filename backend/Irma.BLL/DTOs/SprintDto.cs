using Irma.DAL.Enums;

namespace Irma.BLL.DTOs;

public class SprintDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Goal { get; set; }
    public DateTimeOffset? StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }
    public SprintStatus Status { get; set; }
    public Guid ProjectId { get; set; }
}
