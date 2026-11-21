using Irma.BLL.DTOs;

namespace Irma.BLL.Services;

public interface ITeamService
{
    Task<TeamDto> CreateAsync(TeamCreateDto dto, Guid currentUserId, CancellationToken cancellationToken);
    Task<List<TeamDto>> GetMyTeamsAsync(Guid currentUserId, CancellationToken cancellationToken);
    Task<List<UserDto>> SearchUsersToAddAsync(Guid teamId, string searchTerm, CancellationToken cancellationToken);
    Task AddUserToTeamAsync(Guid teamId, Guid userId, CancellationToken cancellationToken);
}
