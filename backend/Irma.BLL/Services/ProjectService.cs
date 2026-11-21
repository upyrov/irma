using Irma.BLL.DTOs;
using Irma.DAL;
using Irma.DAL.Entities;
using Irma.DAL.Enums;
using Microsoft.EntityFrameworkCore;

namespace Irma.BLL.Services;

public class ProjectService : IProjectService
{
    private readonly AppDbContext _dbContext;

    public ProjectService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<ProjectDto> CreateAsync(ProjectCreateDto dto, Guid currentUserId, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            throw new ArgumentException("Project name is required.");
        }

        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == currentUserId, cancellationToken);
        if (user is null)
        {
            throw new UnauthorizedAccessException();
        }

        var hasTeamAccess = await _dbContext.Teams
            .AnyAsync(t => t.Id == dto.TeamId && t.Members.Any(m => m.Id == currentUserId), cancellationToken);
        if (!hasTeamAccess)
        {
            throw new UnauthorizedAccessException();
        }

        var project = new Project
        {
            Id = Guid.NewGuid(),
            Name = dto.Name.Trim(),
            Description = dto.Description,
            TeamId = dto.TeamId,
            Template = dto.Template
        };

        var projectMember = new ProjectMember
        {
            Id = Guid.NewGuid(),
            ProjectId = project.Id,
            UserId = currentUserId,
            Role = ProjectRole.Owner
        };

        var stageNames = dto.Template switch
        {
            ProjectTemplate.Scrum => new[] { "To Do", "In Progress", "Done" },
            ProjectTemplate.Kanban => new[] { "Backlog", "Selected", "In Progress", "Done" },
            ProjectTemplate.BugTracking => new[] { "New", "In Progress", "Resolved", "Closed" },
            _ => throw new ArgumentOutOfRangeException(nameof(dto.Template), dto.Template, "Unsupported project template.")
        };

        var stages = stageNames
            .Select((name, index) => new Stage
            {
                Id = Guid.NewGuid(),
                Name = name,
                ProjectId = project.Id,
                Order = index + 1
            })
            .ToList();

        _dbContext.Projects.Add(project);
        _dbContext.ProjectMembers.Add(projectMember);
        _dbContext.Stages.AddRange(stages);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new ProjectDto
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            TeamId = project.TeamId,
            Template = project.Template,
            Members =
            [
                new ProjectMemberDto
                {
                    UserId = user.Id,
                    Username = user.Username,
                    Role = ProjectRole.Owner
                }
            ]
        };
    }

    public async Task<List<ProjectDto>> GetMyProjectsAsync(Guid currentUserId, CancellationToken cancellationToken)
    {
        return await _dbContext.Projects
            .Where(p => p.Members.Any(pm => pm.UserId == currentUserId))
            .Select(p => new ProjectDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                TeamId = p.TeamId,
                Template = p.Template,
                Members = p.Members
                    .Select(pm => new ProjectMemberDto
                    {
                        UserId = pm.UserId,
                        Username = pm.User.Username,
                        Role = pm.Role
                    })
                    .ToList()
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<ProjectMemberDto> AddMemberAsync(Guid projectId, AddProjectMemberDto dto, Guid currentUserId, CancellationToken cancellationToken)
    {
        var canManageMembers = await _dbContext.ProjectMembers
            .AnyAsync(pm => pm.ProjectId == projectId
                && pm.UserId == currentUserId
                && (pm.Role == ProjectRole.Owner || pm.Role == ProjectRole.Admin), cancellationToken);
        if (!canManageMembers)
        {
            throw new UnauthorizedAccessException();
        }

        if (dto.Role == ProjectRole.Owner)
        {
            throw new ArgumentException("Owner role cannot be assigned to a new project member.");
        }

        var project = await _dbContext.Projects
            .FirstOrDefaultAsync(p => p.Id == projectId, cancellationToken);
        if (project is null)
        {
            throw new InvalidOperationException("Project not found.");
        }

        var isUserInTeam = await _dbContext.Teams
            .AnyAsync(t => t.Id == project.TeamId && t.Members.Any(m => m.Id == dto.UserId), cancellationToken);
        if (!isUserInTeam)
        {
            throw new InvalidOperationException("User is not a member of the project's team.");
        }

        var targetUser = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Id == dto.UserId, cancellationToken);
        if (targetUser is null)
        {
            throw new InvalidOperationException("Target user was not found.");
        }

        var isAlreadyMember = await _dbContext.ProjectMembers
            .AnyAsync(pm => pm.ProjectId == projectId && pm.UserId == dto.UserId, cancellationToken);
        if (isAlreadyMember)
        {
            throw new InvalidOperationException("User is already a member of this project.");
        }

        var projectMember = new ProjectMember
        {
            Id = Guid.NewGuid(),
            ProjectId = projectId,
            UserId = dto.UserId,
            Role = dto.Role
        };

        _dbContext.ProjectMembers.Add(projectMember);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return new ProjectMemberDto
        {
            UserId = targetUser.Id,
            Username = targetUser.Username,
            Role = projectMember.Role
        };
    }

    public async Task<List<ProjectMemberDto>> GetProjectMembersAsync(Guid projectId, Guid currentUserId, CancellationToken cancellationToken)
    {
        var hasAccess = await _dbContext.ProjectMembers
            .AnyAsync(pm => pm.ProjectId == projectId && pm.UserId == currentUserId, cancellationToken);
        if (!hasAccess)
        {
            throw new UnauthorizedAccessException();
        }

        return await _dbContext.ProjectMembers
            .Where(pm => pm.ProjectId == projectId)
            .Select(pm => new ProjectMemberDto
            {
                UserId = pm.UserId,
                Username = pm.User.Username,
                Role = pm.Role
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<List<StageDto>> GetStagesAsync(Guid projectId, Guid currentUserId, CancellationToken cancellationToken)
    {
        var hasAccess = await _dbContext.ProjectMembers
            .AnyAsync(pm => pm.ProjectId == projectId && pm.UserId == currentUserId, cancellationToken);
        if (!hasAccess)
        {
            throw new UnauthorizedAccessException();
        }

        return await _dbContext.Stages
            .Where(s => s.ProjectId == projectId)
            .OrderBy(s => s.Order)
            .Select(s => new StageDto
            {
                Id = s.Id,
                Name = s.Name,
                Order = s.Order,
                ProjectId = s.ProjectId
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<List<BoardIssueDto>> GetBoardIssuesAsync(Guid projectId, Guid currentUserId, CancellationToken cancellationToken)
    {
        var hasAccess = await _dbContext.ProjectMembers
            .AnyAsync(pm => pm.ProjectId == projectId && pm.UserId == currentUserId, cancellationToken);
        if (!hasAccess)
        {
            throw new UnauthorizedAccessException();
        }

        return await _dbContext.Issues
            .Where(i => i.ProjectId == projectId)
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

    public async Task<List<BoardIssueDto>> GetEpicsAsync(Guid projectId, Guid currentUserId, CancellationToken cancellationToken)
    {
        var hasAccess = await _dbContext.ProjectMembers
            .AnyAsync(pm => pm.ProjectId == projectId && pm.UserId == currentUserId, cancellationToken);
        if (!hasAccess)
        {
            throw new UnauthorizedAccessException();
        }

        return await _dbContext.Issues
            .Where(i => i.ProjectId == projectId && i.IssueType == IssueType.Epic)
            .Select(i => new BoardIssueDto
            {
                Id = i.Id,
                IssueKey = i.IssueKey,
                Title = i.Title,
                Priority = i.Priority,
                StoryPoints = i.StoryPoints,
                Assignee = i.Assignee == null
                    ? null
                    : new UserDto
                    {
                        Id = i.Assignee.Id,
                        Username = i.Assignee.Username
                    },
                StageId = i.StageId
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<MyRoleDto> GetMyRoleAsync(Guid projectId, Guid currentUserId, CancellationToken cancellationToken)
    {
        var projectMember = await _dbContext.ProjectMembers
            .FirstOrDefaultAsync(pm => pm.ProjectId == projectId && pm.UserId == currentUserId, cancellationToken);

        return new MyRoleDto
        {
            Role = projectMember?.Role
        };
    }
}
