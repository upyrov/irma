using Irma.BLL.DTOs;
using Irma.DAL;
using Irma.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace Irma.BLL.Services;

public class TeamService : ITeamService
{
    private readonly AppDbContext _dbContext;

    public TeamService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<TeamDto> CreateAsync(TeamCreateDto dto, Guid currentUserId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            throw new ArgumentException("Team name is required.");
        }

        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == currentUserId, cancellationToken);
        if (user is null)
        {
            throw new UnauthorizedAccessException();
        }

        var team = new Team
        {
            Id = Guid.NewGuid(),
            Name = dto.Name.Trim()
        };

        team.Members.Add(user);

        _dbContext.Teams.Add(team);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new TeamDto
        {
            Id = team.Id,
            Name = team.Name,
            Members =
            [
                new UserDto
                {
                    Id = user.Id,
                    Username = user.Username
                }
            ]
        };
    }

    public async Task<List<TeamDto>> GetMyTeamsAsync(Guid currentUserId, CancellationToken cancellationToken)
    {
        return await _dbContext.Teams
            .Where(t => t.Members.Any(m => m.Id == currentUserId))
            .Select(t => new TeamDto
            {
                Id = t.Id,
                Name = t.Name,
                Members = t.Members
                    .Select(m => new UserDto
                    {
                        Id = m.Id,
                        Username = m.Username
                    })
                    .ToList()
            })
            .ToListAsync(cancellationToken);
    }
}
