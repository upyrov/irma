using System.Security.Claims;
using Irma.BLL.DTOs;
using Irma.BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Irma.WebAPI.Controllers;

[ApiController]
[Authorize]
[Route("api/projects")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpPost]
    public async Task<ActionResult<ProjectDto>> Create([FromBody] ProjectCreateDto dto, CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var currentUserId))
        {
            return Unauthorized();
        }

        var project = await _projectService.CreateAsync(dto, currentUserId, cancellationToken);
        return Ok(project);
    }

    [HttpGet]
    public async Task<ActionResult<List<ProjectDto>>> GetMyProjects(CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var currentUserId))
        {
            return Unauthorized();
        }

        var projects = await _projectService.GetMyProjectsAsync(currentUserId, cancellationToken);
        return Ok(projects);
    }

    [HttpPost("{projectId:guid}/members")]
    public async Task<ActionResult<ProjectMemberDto>> AddMember(Guid projectId, [FromBody] AddProjectMemberDto dto, CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var currentUserId))
        {
            return Unauthorized();
        }

        var member = await _projectService.AddMemberAsync(projectId, dto, currentUserId, cancellationToken);
        return Ok(member);
    }

    [HttpGet("{projectId:guid}/members")]
    public async Task<ActionResult<List<ProjectMemberDto>>> GetProjectMembers(Guid projectId, CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var currentUserId))
        {
            return Unauthorized();
        }

        var members = await _projectService.GetProjectMembersAsync(projectId, currentUserId, cancellationToken);
        return Ok(members);
    }

    [HttpGet("{id:guid}/stages")]
    public async Task<ActionResult<List<StageDto>>> GetStages(Guid id, CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var currentUserId))
        {
            return Unauthorized();
        }

        var stages = await _projectService.GetStagesAsync(id, currentUserId, cancellationToken);
        return Ok(stages);
    }

    [HttpGet("{id:guid}/board")]
    public async Task<ActionResult<List<BoardIssueDto>>> GetBoard(Guid id, CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var currentUserId))
        {
            return Unauthorized();
        }

        var issues = await _projectService.GetBoardIssuesAsync(id, currentUserId, cancellationToken);
        return Ok(issues);
    }
}
