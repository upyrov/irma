using System.Security.Claims;
using Irma.BLL.DTOs;
using Irma.BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Irma.WebAPI.Controllers;

[ApiController]
[Authorize]
[Route("api/teams")]
public class TeamsController : ControllerBase
{
    private readonly ITeamService _teamService;

    public TeamsController(ITeamService teamService)
    {
        _teamService = teamService;
    }

    [HttpPost]
    public async Task<ActionResult<TeamDto>> Create([FromBody] TeamCreateDto dto, CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var currentUserId))
        {
            return Unauthorized();
        }

        var team = await _teamService.CreateAsync(dto, currentUserId, cancellationToken);
        return Ok(team);
    }

    [HttpGet]
    public async Task<ActionResult<List<TeamDto>>> GetMyTeams(CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var currentUserId))
        {
            return Unauthorized();
        }

        var teams = await _teamService.GetMyTeamsAsync(currentUserId, cancellationToken);
        return Ok(teams);
    }

    [HttpGet("{teamId:guid}/search-users")]
    public async Task<ActionResult<List<UserDto>>> SearchUsersToAdd(Guid teamId, [FromQuery] string? query, CancellationToken cancellationToken)
    {
        var users = await _teamService.SearchUsersToAddAsync(teamId, query ?? string.Empty, cancellationToken);
        return Ok(users);
    }

    [HttpPost("{teamId:guid}/members/{userId:guid}")]
    public async Task<ActionResult> AddUserToTeam(Guid teamId, Guid userId, CancellationToken cancellationToken)
    {
        await _teamService.AddUserToTeamAsync(teamId, userId, cancellationToken);
        return NoContent();
    }
}
