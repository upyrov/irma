using Irma.BLL.DTOs;

namespace Irma.BLL.Services;

public interface IIssueService
{
    Task<IssueDto> CreateAsync(IssueCreateDto dto, Guid currentUserId, CancellationToken cancellationToken);
}
