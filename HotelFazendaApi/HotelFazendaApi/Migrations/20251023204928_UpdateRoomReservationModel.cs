using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HotelFazendaApi.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRoomReservationModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Rooms",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Numero = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Capacidade = table.Column<int>(type: "int", nullable: false, defaultValue: 2),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Livre")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rooms", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Reservations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HospedeNome = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: false),
                    HospedeDocumento = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                    Telefone = table.Column<string>(type: "nvarchar(40)", maxLength: 40, nullable: true),
                    QtdeHospedes = table.Column<int>(type: "int", nullable: false),
                    DataEntrada = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DataSaida = table.Column<DateTime>(type: "datetime2", nullable: false),
                    QuartoId = table.Column<int>(type: "int", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Aberta"),
                    CriadoEm = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reservations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Reservations_Rooms_QuartoId",
                        column: x => x.QuartoId,
                        principalTable: "Rooms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_DataEntrada_DataSaida",
                table: "Reservations",
                columns: new[] { "DataEntrada", "DataSaida" });

            migrationBuilder.CreateIndex(
                name: "IX_Reservations_QuartoId",
                table: "Reservations",
                column: "QuartoId");

            migrationBuilder.CreateIndex(
                name: "IX_Rooms_Numero",
                table: "Rooms",
                column: "Numero",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Reservations");

            migrationBuilder.DropTable(
                name: "Rooms");
        }
    }
}
