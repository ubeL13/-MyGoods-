using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using MyGoods.Application.Exceptions;

namespace MyGoods.Api.Middleware;

/// <summary>
/// Глобальный обработчик исключений: превращает исключения сервисов в HTTP-ответы
/// с нужным кодом и телом в формате ProblemDetails.
/// </summary>
/// <param name="logger">Логгер для записи непредвиденных ошибок</param>
public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    /// <summary>
    /// Обрабатывает исключение, возникшее при выполнении запроса.
    /// </summary>
    /// <param name="httpContext">Контекст текущего запроса</param>
    /// <param name="exception">Пойманное исключение</param>
    /// <param name="cancellationToken">Токен отмены</param>
    /// <returns>True — ответ сформирован</returns>
    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var (status, title) = exception switch
        {
            NotFoundException => (StatusCodes.Status404NotFound, "Не найдено"),
            ValidationException => (StatusCodes.Status400BadRequest, "Ошибка валидации"),
            ConflictException => (StatusCodes.Status409Conflict, "Конфликт"),
            _ => (StatusCodes.Status500InternalServerError, "Внутренняя ошибка сервера")
        };

        if (status == StatusCodes.Status500InternalServerError)
        {
            logger.LogError(exception, "Необработанная ошибка при выполнении запроса {Path}", httpContext.Request.Path);
        }

        var problem = new ProblemDetails
        {
            Status = status,
            Title = title,
            Detail = status == StatusCodes.Status500InternalServerError ? null : exception.Message
        };

        httpContext.Response.StatusCode = status;
        await httpContext.Response.WriteAsJsonAsync(problem, cancellationToken);
        return true;
    }
}
