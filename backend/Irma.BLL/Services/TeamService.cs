using Irma.BLL.DTOs;
using Irma.BLL.Exceptions;
using Irma.DAL;
using Irma.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace Irma.BLL.Services;

public class TeamService : ITeamService
{
    public const int MinSearchLength = 2;
    private const int SearchLimit = 20;

    private readonly AppDbContext _dbContext;

    public TeamService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<TeamDto> CreateAsync(TeamCreateDto dto, Guid currentUserId, CancellationToken cancellationToken)
    {
        var name = dto.Name?.Trim() ?? string.Empty;
        if (name.Length == 0)
        {
            throw new ArgumentException("Team name is required.");
        }

        if (name.Length > TeamCreateDto.NameMaxLength)
        {
            throw new ArgumentException($"Team name must not exceed {TeamCreateDto.NameMaxLength} characters.");
        }

        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == currentUserId, cancellationToken)
            ?? throw new UnauthorizedAccessException();

        var team = new Team
        {
            Id = Guid.NewGuid(),
            Name = name
        };

        team.Members.Add(user);

        _dbContext.Teams.Add(team);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return ToDto(team);
    }

    public async Task<List<TeamDto>> GetMyTeamsAsync(Guid currentUserId, CancellationToken cancellationToken)
    {
        return await _dbContext.Teams
            .Where(t => t.Members.Any(m => m.Id == currentUserId))
            .OrderBy(t => t.Name)
            .Select(t => new TeamDto
            {
                Id = t.Id,
                Name = t.Name,
                Members = t.Members
                    .OrderBy(m => m.Username)
                    .Select(m => new UserDto
                    {
                        Id = m.Id,
                        Username = m.Username
                    })
                    .ToList()
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<List<UserDto>> SearchUsersAsync(string searchTerm, Guid? teamId, Guid currentUserId, CancellationToken cancellationToken)
    {
        var term = searchTerm?.Trim() ?? string.Empty;
        if (term.Length < MinSearchLength)
        {
            // Порожній запит не повинен віддавати список усіх користувачів
            return [];
        }

        var query = _dbContext.Users.Where(u => u.Id != currentUserId);

        if (teamId is { } id)
        {
            await EnsureTeamMemberAsync(id, currentUserId, cancellationToken);
            query = query.Where(u => !u.Teams.Any(t => t.Id == id));
        }

        var pattern = $"%{EscapeLike(term)}%";

        return await query
            .Where(u => EF.Functions.ILike(u.Username, pattern, "\\"))
            .OrderBy(u => u.Username.Length)
            .ThenBy(u => u.Username)
            .Take(SearchLimit)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<TeamDto> AddUserToTeamAsync(Guid teamId, Guid userId, Guid currentUserId, CancellationToken cancellationToken)
    {
        var team = await _dbContext.Teams
            .Include(t => t.Members)
            .FirstOrDefaultAsync(t => t.Id == teamId, cancellationToken)
            ?? throw new NotFoundException("Team not found.");

        if (team.Members.All(m => m.Id != currentUserId))
        {
            throw new ForbiddenException("You are not a member of this team.");
        }

        if (team.Members.Any(m => m.Id == userId))
        {
            throw new ConflictException("User is already a member of this team.");
        }

        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken)
            ?? throw new NotFoundException("User not found.");

        team.Members.Add(user);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return ToDto(team);
    }

    private async Task EnsureTeamMemberAsync(Guid teamId, Guid currentUserId, CancellationToken cancellationToken)
    {
        var team = await _dbContext.Teams
            .Where(t => t.Id == teamId)
            .Select(t => new { IsMember = t.Members.Any(m => m.Id == currentUserId) })
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new NotFoundException("Team not found.");

        if (!team.IsMember)
        {
            throw new ForbiddenException("You are not a member of this team.");
        }
    }

    private static string EscapeLike(string value) =>
        value.Replace("\\", "\\\\").Replace("%", "\\%").Replace("_", "\\_");

    private static TeamDto ToDto(Team team) => new()
    {
        Id = team.Id,
        Name = team.Name,
        Members = team.Members
            .OrderBy(m => m.Username)
            .Select(m => new UserDto { Id = m.Id, Username = m.Username })
            .ToList()
    };
}
