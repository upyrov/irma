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
}
