namespace Irma.BLL.Exceptions;

/// <summary>Ресурс не знайдено → 404.</summary>
public sealed class NotFoundException(string message) : Exception(message);

/// <summary>Користувач автентифікований, але не має доступу до ресурсу → 403.</summary>
public sealed class ForbiddenException(string message) : Exception(message);

/// <summary>Стан ресурсу не дозволяє дію (дублікат тощо) → 409.</summary>
public sealed class ConflictException(string message) : Exception(message);
