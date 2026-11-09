using Irma.DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Irma.DAL.Configurations;

public class IssueConfiguration : IEntityTypeConfiguration<Issue>
{
    public void Configure(EntityTypeBuilder<Issue> builder)
    {
        builder.ToTable("Issues");

        builder.HasKey(i => i.Id);

        builder.Property(i => i.IssueKey)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(i => i.IssueKey)
            .IsUnique();

        builder.Property(i => i.Title)
            .IsRequired()
            .HasMaxLength(300);

        builder.Property(i => i.Description)
            .HasMaxLength(4000);

        builder.HasOne(i => i.Project)
            .WithMany(p => p.Issues)
            .HasForeignKey(i => i.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(i => i.Stage)
            .WithMany(s => s.Issues)
            .HasForeignKey(i => i.StageId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(i => i.Sprint)
            .WithMany(s => s.Issues)
            .HasForeignKey(i => i.SprintId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(i => i.Epic)
            .WithMany(i => i.SubIssues)
            .HasForeignKey(i => i.EpicId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasOne(i => i.Assignee)
            .WithMany(u => u.AssignedIssues)
            .HasForeignKey(i => i.AssigneeId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(i => i.Comments)
            .WithOne(c => c.Issue)
            .HasForeignKey(c => c.IssueId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
