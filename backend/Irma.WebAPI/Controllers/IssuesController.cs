using System.Security.Claims;
using Irma.BLL.DTOs;
using Irma.BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Irma.WebAPI.Controllers;

[ApiController]
[Authorize]
[Route("api/issues")]
public class IssuesController : ControllerBase
{
    private readonly IIssueService _issueService;

    public IssuesController(IIssueService issueService)
    {
        _issueService = issueService;
    }

    [HttpPost]
    public async Task<ActionResult<IssueDto>> Create([FromBody] IssueCreateDto dto, CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var currentUserId))
        {
            return Unauthorized();
        }

        var issue = await _issueService.CreateAsync(dto, currentUserId, cancellationToken);
        return Ok(issue);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<IssueDto>> GetById(Guid id, CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var currentUserId))
        {
            return Unauthorized();
        }

        var issue = await _issueService.GetByIdAsync(id, currentUserId, cancellationToken);
        return Ok(issue);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<IssueDto>> Update(Guid id, [FromBody] IssueUpdateDto dto, CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var currentUserId))
        {
            return Unauthorized();
        }

        var issue = await _issueService.UpdateAsync(id, dto, currentUserId, cancellationToken);
        return Ok(issue);
    }

    [HttpGet("{id:guid}/comments")]
    public async Task<ActionResult<List<CommentDto>>> GetComments(Guid id, CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var currentUserId))
        {
            return Unauthorized();
        }

        var comments = await _issueService.GetCommentsAsync(id, currentUserId, cancellationToken);
        return Ok(comments);
    }

    [HttpPost("{id:guid}/comments")]
    public async Task<ActionResult<CommentDto>> CreateComment(Guid id, [FromBody] CommentCreateDto dto, CancellationToken cancellationToken)
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdValue, out var currentUserId))
        {
            return Unauthorized();
        }

        var comment = await _issueService.CreateCommentAsync(id, dto, currentUserId, cancellationToken);
        return Ok(comment);
    }
}
