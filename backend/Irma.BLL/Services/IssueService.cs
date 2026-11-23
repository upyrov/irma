using System.Text;
using Irma.BLL.DTOs;
using Irma.BLL.Exceptions;
using Irma.DAL;
using Irma.DAL.Entities;
using Irma.DAL.Enums;
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
            throw new NotFoundException("Stage was not found.");
        }

        var role = await _dbContext.RequireRoleAsync(projectId.Value, currentUserId, cancellationToken);
        ProjectAccess.EnsureCanEdit(role);

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
            await EnsureSprintAcceptsIssuesAsync(dto.SprintId.Value, projectId.Value, cancellationToken);
        }

        if (dto.EpicId.HasValue)
        {
            if (dto.IssueType == IssueType.Epic)
            {
                throw new ArgumentException("An epic cannot belong to another epic.");
            }

            await EnsureEpicAsync(dto.EpicId.Value, projectId.Value, cancellationToken);
        }

        var projectName = await _dbContext.Projects
            .Where(p => p.Id == projectId.Value)
            .Select(p => p.Name)
            .FirstAsync(cancellationToken);
        var prefix = GetProjectPrefix(projectName);

        // Номер = кількість задач + 1. Щоб одночасні запити не отримали однаковий ключ,
        // блокуємо рядок проєкту до кінця транзакції: номери в межах проєкту видаються по черзі.
        await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);
        await _dbContext.Database.ExecuteSqlInterpolatedAsync(
            $"""SELECT 1 FROM "Projects" WHERE "Id" = {projectId.Value} FOR UPDATE""",
            cancellationToken);
        var issueKey = $"{prefix}-{await NextIssueNumberAsync(projectId.Value, cancellationToken)}";

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
        await transaction.CommitAsync(cancellationToken);

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
            throw new NotFoundException("Issue was not found.");
        }

        await _dbContext.RequireRoleAsync(issue.ProjectId, currentUserId, cancellationToken);

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
            throw new NotFoundException("Issue was not found.");
        }

        var role = await _dbContext.RequireRoleAsync(issue.ProjectId, currentUserId, cancellationToken);
        ProjectAccess.EnsureCanEdit(role);

        // Member керує статусом і виконавцем лише своїх (або ще нічиїх) задач
        var isSomeoneElses = issue.AssigneeId.HasValue && issue.AssigneeId.Value != currentUserId;
        if (!ProjectAccess.IsManager(role) && isSomeoneElses)
        {
            if (dto.StageId.HasValue && dto.StageId.Value != issue.StageId)
            {
                throw new ForbiddenException("Members can only change the status of issues assigned to them.");
            }

            if (dto.ClearAssignee || (dto.AssigneeId.HasValue && dto.AssigneeId.Value != issue.AssigneeId))
            {
                throw new ForbiddenException("Members cannot reassign issues assigned to other users.");
            }
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

        if (dto.SprintId.HasValue && dto.SprintId.Value != issue.SprintId)
        {
            await EnsureSprintAcceptsIssuesAsync(dto.SprintId.Value, issue.ProjectId, cancellationToken);
        }

        if (dto.EpicId.HasValue && dto.EpicId.Value != issue.EpicId)
        {
            if (dto.EpicId.Value == issue.Id)
            {
                throw new ArgumentException("Issue cannot be its own epic.");
            }

            if (issue.IssueType == IssueType.Epic)
            {
                throw new ArgumentException("An epic cannot belong to another epic.");
            }

            await EnsureEpicAsync(dto.EpicId.Value, issue.ProjectId, cancellationToken);
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

        if (dto.ClearSprint)
        {
            issue.SprintId = null;
        }

        if (dto.ClearEpic)
        {
            issue.EpicId = null;
        }

        if (dto.ClearAssignee)
        {
            issue.AssigneeId = null;
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

    public async Task<List<CommentDto>> GetCommentsAsync(Guid issueId, Guid currentUserId, CancellationToken cancellationToken)
    {
        var issueProjectId = await _dbContext.Issues
            .Where(i => i.Id == issueId)
            .Select(i => (Guid?)i.ProjectId)
            .FirstOrDefaultAsync(cancellationToken);
        if (!issueProjectId.HasValue)
        {
            throw new NotFoundException("Issue was not found.");
        }

        await _dbContext.RequireRoleAsync(issueProjectId.Value, currentUserId, cancellationToken);

        return await _dbContext.Comments
            .Where(c => c.IssueId == issueId)
            .OrderBy(c => c.CreatedAt)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                Text = c.Text,
                CreatedAt = c.CreatedAt,
                IssueId = c.IssueId,
                Author = new UserDto
                {
                    Id = c.Author.Id,
                    Username = c.Author.Username
                }
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<CommentDto> CreateCommentAsync(Guid issueId, CommentCreateDto dto, Guid currentUserId, CancellationToken cancellationToken)
    {
        var issueProjectId = await _dbContext.Issues
            .Where(i => i.Id == issueId)
            .Select(i => (Guid?)i.ProjectId)
            .FirstOrDefaultAsync(cancellationToken);
        if (!issueProjectId.HasValue)
        {
            throw new NotFoundException("Issue was not found.");
        }

        var role = await _dbContext.RequireRoleAsync(issueProjectId.Value, currentUserId, cancellationToken);
        ProjectAccess.EnsureCanEdit(role);

        var author = await _dbContext.Users
            .Where(u => u.Id == currentUserId)
            .Select(u => new { u.Id, u.Username })
            .FirstOrDefaultAsync(cancellationToken);
        if (author is null)
        {
            throw new UnauthorizedAccessException();
        }

        var comment = new Comment
        {
            Id = Guid.NewGuid(),
            Text = dto.Text.Trim(),
            CreatedAt = DateTime.UtcNow,
            AuthorId = currentUserId,
            IssueId = issueId
        };

        _dbContext.Comments.Add(comment);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new CommentDto
        {
            Id = comment.Id,
            Text = comment.Text,
            CreatedAt = comment.CreatedAt,
            IssueId = comment.IssueId,
            Author = new UserDto
            {
                Id = author.Id,
                Username = author.Username
            }
        };
    }

    /// <summary>Задачі не видаляються, тож наступний номер = кількість задач проєкту + 1</summary>
    private async Task<int> NextIssueNumberAsync(Guid projectId, CancellationToken cancellationToken) =>
        await _dbContext.Issues.CountAsync(i => i.ProjectId == projectId, cancellationToken) + 1;

    private async Task EnsureSprintAcceptsIssuesAsync(Guid sprintId, Guid projectId, CancellationToken cancellationToken)
    {
        var status = await _dbContext.Sprints
            .Where(s => s.Id == sprintId && s.ProjectId == projectId)
            .Select(s => (SprintStatus?)s.Status)
            .FirstOrDefaultAsync(cancellationToken)
            ?? throw new ArgumentException("Sprint does not belong to this project.");

        if (status == SprintStatus.Closed)
        {
            throw new ArgumentException("Cannot add an issue to a closed sprint.");
        }
    }

    private async Task EnsureEpicAsync(Guid epicId, Guid projectId, CancellationToken cancellationToken)
    {
        var isEpic = await _dbContext.Issues
            .AnyAsync(i => i.Id == epicId && i.ProjectId == projectId && i.IssueType == IssueType.Epic, cancellationToken);
        if (!isEpic)
        {
            throw new ArgumentException("Epic does not belong to this project.");
        }
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
