using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyGoods.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSupplyExpectedDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateOnly>(
                name: "ExpectedDate",
                table: "Supplies",
                type: "date",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpectedDate",
                table: "Supplies");
        }
    }
}
