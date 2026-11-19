using Irma.BLL.DTOs;

namespace Irma.BLL.Services;

public interface ITeamService
{
    Task<TeamDto> CreateAsync(TeamCreateDto dto, Guid currentUserId, CancellationToken cancellationToken);
    Task<List<TeamDto>> GetMyTeamsAsync(Guid currentUserId, CancellationToken cancellationToken);
}
