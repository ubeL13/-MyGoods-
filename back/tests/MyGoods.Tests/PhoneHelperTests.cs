using MyGoods.Application.Helpers;

namespace MyGoods.Tests;

/// <summary>
/// Тесты приведения телефона к единому виду 79991234567.
/// </summary>
public class PhoneHelperTests
{
    /// <summary>
    /// Разные записи одного номера приводятся к одному виду, неверные — null.
    /// </summary>
    [Theory]
    [InlineData("+7 (912) 345-67-89", "79123456789")]
    [InlineData("8 912 345 67 89", "79123456789")]
    [InlineData("89123456789", "79123456789")]
    [InlineData("9123456789", "79123456789")]
    [InlineData("12345", null)]
    [InlineData("", null)]
    [InlineData("+1 234 567 89 01", null)]
    public void Normalize_ReturnsUnifiedFormat(string input, string? expected)
    {
        Assert.Equal(expected, PhoneHelper.Normalize(input));
    }
}
