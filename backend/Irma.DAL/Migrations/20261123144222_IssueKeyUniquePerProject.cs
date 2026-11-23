using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Irma.DAL.Migrations
{
    /// <inheritdoc />
    public partial class IssueKeyUniquePerProject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Issues_IssueKey",
                table: "Issues");

            migrationBuilder.DropIndex(
                name: "IX_Issues_ProjectId",
                table: "Issues");

            migrationBuilder.CreateIndex(
                name: "IX_Issues_ProjectId_IssueKey",
                table: "Issues",
                columns: new[] { "ProjectId", "IssueKey" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Issues_ProjectId_IssueKey",
                table: "Issues");

            migrationBuilder.CreateIndex(
                name: "IX_Issues_IssueKey",
                table: "Issues",
                column: "IssueKey",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Issues_ProjectId",
                table: "Issues",
                column: "ProjectId");
        }
    }
}
