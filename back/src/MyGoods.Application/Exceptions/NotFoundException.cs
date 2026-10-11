namespace MyGoods.Application.Exceptions;

/// <summary>
/// Запрошенный объект не найден (HTTP 404).
/// </summary>
/// <param name="message">Текст ошибки для клиента</param>
public class NotFoundException(string message) : Exception(message);
