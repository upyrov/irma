using Irma.BLL.Exceptions;
using Irma.DAL;
using Irma.DAL.Enums;
using Microsoft.EntityFrameworkCore;

namespace Irma.BLL.Services;

/// <summary>
/// RBAC проєкту — одне місце для перевірок ролей (Owner / Admin / Member / Viewer).
/// Ті самі правила показує фронтенд у таблиці прав на сторінці налаштувань.
/// </summary>
internal static class ProjectAccess
{
    /// <summary>Роль користувача в проєкті. Проєкту немає → 404, не учасник → 403.</summary>
    public static async Task<ProjectRole> RequireRoleAsync(
        this AppDbContext dbContext, Guid projectId, Guid userId, CancellationToken cancellationToken)
    {
        var role = await dbContext.ProjectMembers
            .Where(pm => pm.ProjectId == projectId && pm.UserId == userId)
            .Select(pm => (ProjectRole?)pm.Role)
            .FirstOrDefaultAsync(cancellationToken);

        if (role.HasValue)
        {
            return role.Value;
        }

        var projectExists = await dbContext.Projects.AnyAsync(p => p.Id == projectId, cancellationToken);
        throw projectExists
            ? new ForbiddenException("You are not a member of this project.")
            : new NotFoundException("Project not found.");
    }

    public static bool IsManager(ProjectRole role) => role is ProjectRole.Owner or ProjectRole.Admin;

    /// <summary>Створення / редагування задач і коментарі — усі, крім Viewer</summary>
    public static void EnsureCanEdit(ProjectRole role)
    {
        if (role == ProjectRole.Viewer)
        {
            throw new ForbiddenException("Viewers cannot modify the project.");
        }
    }

    /// <summary>Учасники, ролі, спринти — лише Owner / Admin</summary>
    public static void EnsureCanManage(ProjectRole role)
    {
        if (!IsManager(role))
        {
            throw new ForbiddenException("Only the project owner or admins can do this.");
        }
    }
}
