using Irma.BLL.DTOs;

namespace Irma.BLL.Services;

public interface ITeamService
{
    Task<TeamDto> CreateAsync(TeamCreateDto dto, Guid currentUserId, CancellationToken cancellationToken);
    Task<List<TeamDto>> GetMyTeamsAsync(Guid currentUserId, CancellationToken cancellationToken);

    /// <summary>
    /// Пошук користувачів за username (без урахування регістру). Поточний користувач у видачу не потрапляє.
    /// Якщо передано <paramref name="teamId"/> — лише ті, кого ще немає в цій команді
    /// (і поточний користувач мусить бути її учасником).
    /// </summary>
    Task<List<UserDto>> SearchUsersAsync(string searchTerm, Guid? teamId, Guid currentUserId, CancellationToken cancellationToken);

    /// <summary>Додає користувача в команду. Додавати можуть лише учасники команди.</summary>
    Task<TeamDto> AddUserToTeamAsync(Guid teamId, Guid userId, Guid currentUserId, CancellationToken cancellationToken);
}
