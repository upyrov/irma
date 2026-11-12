using Irma.BLL.DTOs;
using Irma.DAL;
using Microsoft.EntityFrameworkCore;

namespace Irma.BLL.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _dbContext;

    public UserService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<UserDto?> GetCurrentUserAsync(Guid userId, CancellationToken cancellationToken)
    {
        return await _dbContext.Users
            .Where(u => u.Id == userId)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username
            })
            .FirstOrDefaultAsync(cancellationToken);
    }
}
