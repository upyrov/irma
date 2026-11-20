using Irma.BLL.DTOs;

namespace Irma.BLL.Services;

public interface IIssueService
{
    Task<IssueDto> CreateAsync(IssueCreateDto dto, Guid currentUserId, CancellationToken cancellationToken);
    Task<IssueDto> GetByIdAsync(Guid issueId, Guid currentUserId, CancellationToken cancellationToken);
    Task<IssueDto> UpdateAsync(Guid issueId, IssueUpdateDto dto, Guid currentUserId, CancellationToken cancellationToken);
}
