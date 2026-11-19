using Irma.BLL.DTOs;

namespace Irma.BLL.Services;

public interface IProjectService
{
    Task<ProjectDto> CreateAsync(ProjectCreateDto dto, Guid currentUserId, CancellationToken cancellationToken);
    Task<List<ProjectDto>> GetMyProjectsAsync(Guid currentUserId, CancellationToken cancellationToken);
    Task<List<ProjectMemberDto>> GetProjectMembersAsync(Guid projectId, Guid currentUserId, CancellationToken cancellationToken);
    Task<ProjectMemberDto> AddMemberAsync(Guid projectId, AddProjectMemberDto dto, Guid currentUserId, CancellationToken cancellationToken);
}
