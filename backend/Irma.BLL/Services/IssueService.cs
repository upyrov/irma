using System.Text;
using Irma.BLL.DTOs;
using Irma.DAL;
using Irma.DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace Irma.BLL.Services;

public class IssueService : IIssueService
{
    private readonly AppDbContext _dbContext;

    public IssueService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IssueDto> CreateAsync(IssueCreateDto dto, Guid currentUserId, CancellationToken cancellationToken)
    {
        var projectId = await _dbContext.Stages
            .Where(s => s.Id == dto.StageId)
            .Select(s => (Guid?)s.ProjectId)
            .FirstOrDefaultAsync(cancellationToken);
        if (!projectId.HasValue)
        {
            throw new ArgumentException("Stage was not found.");
        }

        var hasAccess = await _dbContext.ProjectMembers
            .AnyAsync(pm => pm.ProjectId == projectId.Value && pm.UserId == currentUserId, cancellationToken);
        if (!hasAccess)
        {
            throw new UnauthorizedAccessException();
        }

        if (dto.AssigneeId.HasValue)
        {
            var assigneeHasAccess = await _dbContext.ProjectMembers
                .AnyAsync(pm => pm.ProjectId == projectId.Value && pm.UserId == dto.AssigneeId.Value, cancellationToken);
            if (!assigneeHasAccess)
            {
                throw new ArgumentException("Assignee is not a member of this project.");
            }
        }

        if (dto.SprintId.HasValue)
        {
            var sprintBelongsToProject = await _dbContext.Sprints
                .AnyAsync(s => s.Id == dto.SprintId.Value && s.ProjectId == projectId.Value, cancellationToken);
            if (!sprintBelongsToProject)
            {
                throw new ArgumentException("Sprint does not belong to this project.");
            }
        }

        if (dto.EpicId.HasValue)
        {
            var epicBelongsToProject = await _dbContext.Issues
                .AnyAsync(i => i.Id == dto.EpicId.Value && i.ProjectId == projectId.Value, cancellationToken);
            if (!epicBelongsToProject)
            {
                throw new ArgumentException("Epic does not belong to this project.");
            }
        }

        var projectName = await _dbContext.Projects
            .Where(p => p.Id == projectId.Value)
            .Select(p => p.Name)
            .FirstAsync(cancellationToken);

        var issueCount = await _dbContext.Issues
            .CountAsync(i => i.ProjectId == projectId.Value, cancellationToken);
        var issueKey = $"{GetProjectPrefix(projectName)}-{issueCount + 1}";

        var issue = new Issue
        {
            Id = Guid.NewGuid(),
            IssueKey = issueKey,
            Title = dto.Title.Trim(),
            Description = dto.Description,
            IssueType = dto.IssueType,
            Priority = dto.Priority,
            StoryPoints = dto.StoryPoints,
            AssigneeId = dto.AssigneeId,
            ProjectId = projectId.Value,
            StageId = dto.StageId,
            SprintId = dto.SprintId,
            EpicId = dto.EpicId,
            CreatedAt = DateTime.UtcNow
        };

        _dbContext.Issues.Add(issue);
        await _dbContext.SaveChangesAsync(cancellationToken);

        UserDto? assignee = null;
        if (issue.AssigneeId.HasValue)
        {
            assignee = await _dbContext.Users
                .Where(u => u.Id == issue.AssigneeId.Value)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Username = u.Username
                })
                .FirstOrDefaultAsync(cancellationToken);
        }

        return new IssueDto
        {
            Id = issue.Id,
            IssueKey = issue.IssueKey,
            Title = issue.Title,
            Description = issue.Description,
            IssueType = issue.IssueType,
            Priority = issue.Priority,
            StoryPoints = issue.StoryPoints,
            Assignee = assignee,
            StageId = issue.StageId,
            SprintId = issue.SprintId,
            EpicId = issue.EpicId,
            CreatedAt = issue.CreatedAt
        };
    }

    public async Task<IssueDto> GetByIdAsync(Guid issueId, Guid currentUserId, CancellationToken cancellationToken)
    {
        var issue = await _dbContext.Issues
            .Where(i => i.Id == issueId)
            .Select(i => new
            {
                i.Id,
                i.IssueKey,
                i.Title,
                i.Description,
                i.IssueType,
                i.Priority,
                i.StoryPoints,
                i.StageId,
                i.SprintId,
                i.EpicId,
                i.CreatedAt,
                i.ProjectId,
                Assignee = i.Assignee == null
                    ? null
                    : new UserDto
                    {
                        Id = i.Assignee.Id,
                        Username = i.Assignee.Username
                    }
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (issue is null)
        {
            throw new ArgumentException("Issue was not found.");
        }

        var hasAccess = await _dbContext.ProjectMembers
            .AnyAsync(pm => pm.ProjectId == issue.ProjectId && pm.UserId == currentUserId, cancellationToken);
        if (!hasAccess)
        {
            throw new UnauthorizedAccessException();
        }

        return new IssueDto
        {
            Id = issue.Id,
            IssueKey = issue.IssueKey,
            Title = issue.Title,
            Description = issue.Description,
            IssueType = issue.IssueType,
            Priority = issue.Priority,
            StoryPoints = issue.StoryPoints,
            Assignee = issue.Assignee,
            StageId = issue.StageId,
            SprintId = issue.SprintId,
            EpicId = issue.EpicId,
            CreatedAt = issue.CreatedAt
        };
    }

    public async Task<IssueDto> UpdateAsync(Guid issueId, IssueUpdateDto dto, Guid currentUserId, CancellationToken cancellationToken)
    {
        var issue = await _dbContext.Issues
            .FirstOrDefaultAsync(i => i.Id == issueId, cancellationToken);
        if (issue is null)
        {
            throw new ArgumentException("Issue was not found.");
        }

        var hasAccess = await _dbContext.ProjectMembers
            .AnyAsync(pm => pm.ProjectId == issue.ProjectId && pm.UserId == currentUserId, cancellationToken);
        if (!hasAccess)
        {
            throw new UnauthorizedAccessException();
        }

        if (dto.StageId.HasValue && dto.StageId.Value != issue.StageId)
        {
            var stageBelongsToProject = await _dbContext.Stages
                .AnyAsync(s => s.Id == dto.StageId.Value && s.ProjectId == issue.ProjectId, cancellationToken);
            if (!stageBelongsToProject)
            {
                throw new ArgumentException("Stage does not belong to this project.");
            }
        }

        if (dto.AssigneeId.HasValue)
        {
            var assigneeHasAccess = await _dbContext.ProjectMembers
                .AnyAsync(pm => pm.ProjectId == issue.ProjectId && pm.UserId == dto.AssigneeId.Value, cancellationToken);
            if (!assigneeHasAccess)
            {
                throw new ArgumentException("Assignee is not a member of this project.");
            }
        }

        if (dto.SprintId.HasValue)
        {
            var sprintBelongsToProject = await _dbContext.Sprints
                .AnyAsync(s => s.Id == dto.SprintId.Value && s.ProjectId == issue.ProjectId, cancellationToken);
            if (!sprintBelongsToProject)
            {
                throw new ArgumentException("Sprint does not belong to this project.");
            }
        }

        if (dto.EpicId.HasValue)
        {
            if (dto.EpicId.Value == issue.Id)
            {
                throw new ArgumentException("Issue cannot be its own epic.");
            }

            var epicBelongsToProject = await _dbContext.Issues
                .AnyAsync(i => i.Id == dto.EpicId.Value && i.ProjectId == issue.ProjectId, cancellationToken);
            if (!epicBelongsToProject)
            {
                throw new ArgumentException("Epic does not belong to this project.");
            }
        }

        if (dto.Title is not null)
        {
            issue.Title = dto.Title.Trim();
        }

        if (dto.Description is not null)
        {
            issue.Description = dto.Description;
        }

        if (dto.Priority.HasValue)
        {
            issue.Priority = dto.Priority.Value;
        }

        if (dto.StoryPoints.HasValue)
        {
            issue.StoryPoints = dto.StoryPoints.Value;
        }

        if (dto.AssigneeId.HasValue)
        {
            issue.AssigneeId = dto.AssigneeId.Value;
        }

        if (dto.StageId.HasValue)
        {
            issue.StageId = dto.StageId.Value;
        }

        if (dto.SprintId.HasValue)
        {
            issue.SprintId = dto.SprintId.Value;
        }

        if (dto.EpicId.HasValue)
        {
            issue.EpicId = dto.EpicId.Value;
        }

        await _dbContext.SaveChangesAsync(cancellationToken);

        UserDto? assignee = null;
        if (issue.AssigneeId.HasValue)
        {
            assignee = await _dbContext.Users
                .Where(u => u.Id == issue.AssigneeId.Value)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Username = u.Username
                })
                .FirstOrDefaultAsync(cancellationToken);
        }

        return new IssueDto
        {
            Id = issue.Id,
            IssueKey = issue.IssueKey,
            Title = issue.Title,
            Description = issue.Description,
            IssueType = issue.IssueType,
            Priority = issue.Priority,
            StoryPoints = issue.StoryPoints,
            Assignee = assignee,
            StageId = issue.StageId,
            SprintId = issue.SprintId,
            EpicId = issue.EpicId,
            CreatedAt = issue.CreatedAt
        };
    }

    private static string GetProjectPrefix(string projectName)
    {
        var lettersOnly = new string(projectName
            .Where(char.IsLetter)
            .ToArray())
            .ToUpperInvariant();

        if (lettersOnly.Length >= 4)
        {
            return lettersOnly[..4];
        }

        var builder = new StringBuilder(lettersOnly);
        while (builder.Length < 4)
        {
            builder.Append('X');
        }

        return builder.ToString();
    }
}
