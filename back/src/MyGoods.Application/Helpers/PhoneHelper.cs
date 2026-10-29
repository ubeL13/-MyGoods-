namespace MyGoods.Application.Helpers;

/// <summary>
/// Приведение телефона к единому виду: только цифры, 11 знаков, начинается с 7 (79991234567).
/// Нужен, чтобы «+7 999 123-45-67» и «8 (999) 123-45-67» считались одним номером.
/// </summary>
public static class PhoneHelper
{
    /// <summary>
    /// Возвращает телефон в формате 79991234567 или null, если это не российский номер из 10–11 цифр.
    /// </summary>
    /// <param name="phone">Телефон в любом виде</param>
    public static string? Normalize(string? phone)
    {
        if (string.IsNullOrWhiteSpace(phone))
            return null;

        var digits = new string(phone.Where(char.IsDigit).ToArray());

        if (digits.Length == 10)
            digits = "7" + digits;
        else if (digits.Length == 11 && digits[0] == '8')
            digits = "7" + digits[1..];

        return digits.Length == 11 && digits[0] == '7' ? digits : null;
    }
}
