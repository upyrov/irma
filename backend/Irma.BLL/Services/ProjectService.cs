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
}
