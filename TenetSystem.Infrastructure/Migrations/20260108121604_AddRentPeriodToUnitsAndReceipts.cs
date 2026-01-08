using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TenetSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRentPeriodToUnitsAndReceipts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RentPeriod",
                table: "Units",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RentPeriod",
                table: "RentReceipts",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RentPeriod",
                table: "Units");

            migrationBuilder.DropColumn(
                name: "RentPeriod",
                table: "RentReceipts");
        }
    }
}
