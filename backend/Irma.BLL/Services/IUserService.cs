using Irma.BLL.DTOs;

namespace Irma.BLL.Services;

public interface IUserService
{
    Task<UserDto?> GetCurrentUserAsync(Guid userId, CancellationToken cancellationToken);
}
