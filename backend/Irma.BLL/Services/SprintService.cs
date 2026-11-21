using Irma.BLL.DTOs;
using Irma.DAL;
using Irma.DAL.Entities;
using Irma.DAL.Enums;
using Microsoft.EntityFrameworkCore;

namespace Irma.BLL.Services;

public class SprintService : ISprintService
{
    private readonly AppDbContext _dbContext;

    public SprintService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<SprintDto>> GetByProjectAsync(Guid projectId, Guid currentUserId, CancellationToken cancellationToken)
    {
        await EnsureProjectAccessAsync(projectId, currentUserId, cancellationToken);

        return await _dbContext.Sprints
            .Where(s => s.ProjectId == projectId)
            .OrderBy(s => s.StartDate)
            .ThenBy(s => s.Name)
            .Select(s => new SprintDto
            {
                Id = s.Id,
                Name = s.Name,
                Goal = s.Goal,
                StartDate = s.StartDate,
                EndDate = s.EndDate,
                Status = s.Status,
                ProjectId = s.ProjectId
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<SprintDto> CreateAsync(Guid projectId, SprintCreateDto dto, Guid currentUserId, CancellationToken cancellationToken)
    {
        await EnsureProjectAccessAsync(projectId, currentUserId, cancellationToken);

        var sprint = new Sprint
        {
            Id = Guid.NewGuid(),
            Name = dto.Name.Trim(),
            Goal = dto.Goal,
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            ProjectId = projectId,
            Status = SprintStatus.Planned
        };

        _dbContext.Sprints.Add(sprint);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new SprintDto
        {
            Id = sprint.Id,
            Name = sprint.Name,
            Goal = sprint.Goal,
            StartDate = sprint.StartDate,
            EndDate = sprint.EndDate,
            Status = sprint.Status,
            ProjectId = sprint.ProjectId
        };
    }

    public async Task StartAsync(Guid sprintId, Guid currentUserId, CancellationToken cancellationToken)
    {
        var sprint = await _dbContext.Sprints
            .FirstOrDefaultAsync(s => s.Id == sprintId, cancellationToken);
        if (sprint is null)
        {
            throw new ArgumentException("Sprint was not found.");
        }

        await EnsureProjectAccessAsync(sprint.ProjectId, currentUserId, cancellationToken);
        sprint.Status = SprintStatus.Active;
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task CompleteAsync(Guid sprintId, Guid currentUserId, CancellationToken cancellationToken)
    {
        var sprint = await _dbContext.Sprints
            .FirstOrDefaultAsync(s => s.Id == sprintId, cancellationToken);
        if (sprint is null)
        {
            throw new ArgumentException("Sprint was not found.");
        }

        await EnsureProjectAccessAsync(sprint.ProjectId, currentUserId, cancellationToken);

        var issues = await _dbContext.Issues
            .Where(i => i.SprintId == sprintId)
            .Include(i => i.Stage)
            .ToListAsync(cancellationToken);

        foreach (var issue in issues)
        {
            var stageName = issue.Stage.Name;
            var isCompleteStage = stageName == "Done" || stageName == "Closed" || stageName == "Resolved";
            if (!isCompleteStage)
            {
                issue.SprintId = null;
            }
        }

        sprint.Status = SprintStatus.Closed;
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<BoardIssueDto>> GetBacklogAsync(Guid projectId, Guid currentUserId, CancellationToken cancellationToken)
    {
        await EnsureProjectAccessAsync(projectId, currentUserId, cancellationToken);

        return await _dbContext.Issues
            .Where(i => i.ProjectId == projectId && i.SprintId == null)
            .Select(i => new BoardIssueDto
            {
                Id = i.Id,
                IssueKey = i.IssueKey,
                Title = i.Title,
                Priority = i.Priority,
                StoryPoints = i.StoryPoints,
                StageId = i.StageId,
                Assignee = i.Assignee == null
                    ? null
                    : new UserDto
                    {
                        Id = i.Assignee.Id,
                        Username = i.Assignee.Username
                    }
            })
            .ToListAsync(cancellationToken);
    }

    private async Task EnsureProjectAccessAsync(Guid projectId, Guid currentUserId, CancellationToken cancellationToken)
    {
        var hasAccess = await _dbContext.ProjectMembers
            .AnyAsync(pm => pm.ProjectId == projectId && pm.UserId == currentUserId, cancellationToken);
        if (!hasAccess)
        {
            throw new UnauthorizedAccessException();
        }
    }
}
