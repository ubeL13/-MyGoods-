using MyGoods.Core.Entities;
using MyGoods.Core.Enums;

namespace MyGoods.Tests;

/// <summary>
/// Тесты расчёта статуса остатка.
/// </summary>
public class StockStatusTests
{
    /// <summary>
    /// Статус зависит от количества и минимального остатка.
    /// </summary>
    [Theory]
    [InlineData(0, 5, StockStatus.OutOfStock)]
    [InlineData(0, 0, StockStatus.OutOfStock)]
    [InlineData(3, 5, StockStatus.LessMinimum)]
    [InlineData(5, 5, StockStatus.LessMinimum)]
    [InlineData(6, 5, StockStatus.Available)]
    [InlineData(1, 0, StockStatus.Available)]
    public void Status_DependsOnQuantityAndMin(int quantity, int min, StockStatus expected)
    {
        var stock = new RemainingProduct { Quantity = quantity, Min = min };

        Assert.Equal(expected, stock.Status);
    }

    /// <summary>
    /// Статус считается по доступному количеству: зарезервированный товар продать нельзя.
    /// </summary>
    [Theory]
    [InlineData(5, 5, 1, StockStatus.OutOfStock)]
    [InlineData(5, 3, 2, StockStatus.LessMinimum)]
    [InlineData(10, 2, 2, StockStatus.Available)]
    public void Status_UsesAvailableQuantity(int quantity, int reserved, int min, StockStatus expected)
    {
        var stock = new RemainingProduct { Quantity = quantity, Reserved = reserved, Min = min };

        Assert.Equal(quantity - reserved, stock.Available);
        Assert.Equal(expected, stock.Status);
    }
}
