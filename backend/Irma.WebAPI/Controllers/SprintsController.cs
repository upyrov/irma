using System.Security.Claims;
using Irma.BLL.DTOs;
using Irma.BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Irma.WebAPI.Controllers;

[ApiController]
[Authorize]
public class SprintsController : ControllerBase
{
    private readonly ISprintService _sprintService;

    public SprintsController(ISprintService sprintService)
    {
        _sprintService = sprintService;
    }

    [HttpGet("api/projects/{id:guid}/sprints")]
    public async Task<ActionResult<List<SprintDto>>> GetProjectSprints(Guid id, CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var currentUserId))
        {
            return Unauthorized();
        }

        var sprints = await _sprintService.GetByProjectAsync(id, currentUserId, cancellationToken);
        return Ok(sprints);
    }

    [HttpPost("api/projects/{id:guid}/sprints")]
    public async Task<ActionResult<SprintDto>> Create(Guid id, [FromBody] SprintCreateDto dto, CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var currentUserId))
        {
            return Unauthorized();
        }

        var sprint = await _sprintService.CreateAsync(id, dto, currentUserId, cancellationToken);
        return Ok(sprint);
    }

    [HttpPut("api/sprints/{id:guid}/start")]
    public async Task<IActionResult> Start(Guid id, CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var currentUserId))
        {
            return Unauthorized();
        }

        await _sprintService.StartAsync(id, currentUserId, cancellationToken);
        return NoContent();
    }

    [HttpPut("api/sprints/{id:guid}/complete")]
    public async Task<IActionResult> Complete(Guid id, CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var currentUserId))
        {
            return Unauthorized();
        }

        await _sprintService.CompleteAsync(id, currentUserId, cancellationToken);
        return NoContent();
    }

    [HttpGet("api/projects/{id:guid}/backlog")]
    public async Task<ActionResult<List<BoardIssueDto>>> GetBacklog(Guid id, CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var currentUserId))
        {
            return Unauthorized();
        }

        var backlog = await _sprintService.GetBacklogAsync(id, currentUserId, cancellationToken);
        return Ok(backlog);
    }
}
