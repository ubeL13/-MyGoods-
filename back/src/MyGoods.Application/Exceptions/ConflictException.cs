namespace MyGoods.Application.Exceptions;

/// <summary>
/// Действие противоречит текущему состоянию данных, например артикул уже занят (HTTP 409).
/// </summary>
/// <param name="message">Текст ошибки для клиента</param>
public class ConflictException(string message) : Exception(message);
