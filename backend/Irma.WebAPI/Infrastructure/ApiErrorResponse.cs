namespace Irma.WebAPI.Infrastructure;

public sealed record ApiErrorResponse(
    string ErrorCode,
    string Message,
    int StatusCode,
    string Timestamp);
