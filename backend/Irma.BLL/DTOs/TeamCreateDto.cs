namespace Irma.BLL.DTOs;

public class TeamCreateDto
{
    public const int NameMaxLength = 100;

    public string Name { get; set; } = string.Empty;
}
