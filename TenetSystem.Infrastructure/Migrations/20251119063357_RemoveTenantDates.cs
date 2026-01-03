using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TenetSystem.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveTenantDates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MoveInDate",
                table: "Tenants");

            migrationBuilder.DropColumn(
                name: "MoveOutDate",
                table: "Tenants");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "MoveInDate",
                table: "Tenants",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "MoveOutDate",
                table: "Tenants",
                type: "TEXT",
                nullable: true);
        }
    }
}
