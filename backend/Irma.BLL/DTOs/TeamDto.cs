namespace Irma.BLL.DTOs;

public class TeamDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public List<UserDto> Members { get; set; } = new();
}
