using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace permittable.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Addresses",
                columns: table => new
                {
                    GeoID = table.Column<string>(type: "text", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: true),
                    Postal = table.Column<string>(type: "text", nullable: true),
                    WardGrid = table.Column<string>(type: "text", nullable: true),
                    Latitude = table.Column<float>(type: "real", nullable: true),
                    Longitude = table.Column<float>(type: "real", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Addresses", x => x.GeoID);
                });

            migrationBuilder.CreateTable(
                name: "Permits",
                columns: table => new
                {
                    Number = table.Column<string>(type: "text", nullable: false),
                    Revision = table.Column<int>(type: "integer", nullable: false),
                    AddressGeoID = table.Column<string>(type: "text", nullable: true),
                    Applied = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Issued = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Completed = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PermitType = table.Column<string>(type: "text", nullable: true),
                    StructureType = table.Column<string>(type: "text", nullable: true),
                    ShortDescription = table.Column<string>(type: "text", nullable: true),
                    LongDescription = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: true),
                    CurrentUse = table.Column<string>(type: "text", nullable: true),
                    ProposedUse = table.Column<string>(type: "text", nullable: true),
                    DwellingsCreated = table.Column<int>(type: "integer", nullable: false),
                    DwellingsLost = table.Column<int>(type: "integer", nullable: false),
                    EstimatedCost = table.Column<float>(type: "real", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Permits", x => new { x.Number, x.Revision });
                    table.ForeignKey(
                        name: "FK_Permits_Addresses_AddressGeoID",
                        column: x => x.AddressGeoID,
                        principalTable: "Addresses",
                        principalColumn: "GeoID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Permits_AddressGeoID",
                table: "Permits",
                column: "AddressGeoID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Permits");

            migrationBuilder.DropTable(
                name: "Addresses");
        }
    }
}
