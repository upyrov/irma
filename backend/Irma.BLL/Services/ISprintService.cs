using Irma.BLL.DTOs;

namespace Irma.BLL.Services;

public interface ISprintService
{
    Task<List<SprintDto>> GetByProjectAsync(Guid projectId, Guid currentUserId, CancellationToken cancellationToken);
    Task<SprintDto> CreateAsync(Guid projectId, SprintCreateDto dto, Guid currentUserId, CancellationToken cancellationToken);
    Task StartAsync(Guid sprintId, Guid currentUserId, CancellationToken cancellationToken);
    Task CompleteAsync(Guid sprintId, Guid currentUserId, CancellationToken cancellationToken);
    Task<List<BoardIssueDto>> GetBacklogAsync(Guid projectId, Guid currentUserId, CancellationToken cancellationToken);
}
