namespace MyGoods.Application.Exceptions;

/// <summary>
/// Данные запроса не прошли проверку бизнес-правил (HTTP 400).
/// </summary>
/// <param name="message">Текст ошибки для клиента</param>
public class ValidationException(string message) : Exception(message);
