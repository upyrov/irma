namespace Irma.BLL.DTOs;

public class SprintCreateDto
{
    public string Name { get; set; } = string.Empty;
    public string? Goal { get; set; }
    public DateTimeOffset? StartDate { get; set; }
    public DateTimeOffset? EndDate { get; set; }
    public Guid ProjectId { get; set; }
}
