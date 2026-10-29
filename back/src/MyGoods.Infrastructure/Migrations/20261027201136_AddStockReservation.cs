using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyGoods.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddStockReservation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Reserved",
                table: "RemainingProducts",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddCheckConstraint(
                name: "CK_RemainingProducts_Reserved",
                table: "RemainingProducts",
                sql: "\"Reserved\" >= 0 AND \"Reserved\" <= \"Quantity\"");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropCheckConstraint(
                name: "CK_RemainingProducts_Reserved",
                table: "RemainingProducts");

            migrationBuilder.DropColumn(
                name: "Reserved",
                table: "RemainingProducts");
        }
    }
}
