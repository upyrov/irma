using Irma.BLL.DTOs;
using Irma.DAL.Entities;

namespace Irma.BLL.Services;

public interface IAuthService
{
    Task<string> RegisterAsync(UserRegisterDto dto, CancellationToken cancellationToken);
    Task<string> LoginAsync(UserLoginDto dto, CancellationToken cancellationToken);
}
