import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { ProjectHeader } from "#/components/projectHeader"
import { AddMemberForm } from "#/components/ProjectTemplate/Scrum/settings/addMemberForm"
import { MembersTable } from "#/components/ProjectTemplate/Scrum/settings/membersTable"
import { PermissionsTable } from "#/components/ProjectTemplate/Scrum/settings/permissionsTable"
import type { ProjectMember, ProjectRole } from "#/components/ProjectTemplate/Scrum/settings/types"
import { findProject, guardSection } from "#/lib/projectTemplates"
import { backlogIssues, settingsMembers } from "#/tempData"

export const Route = createFileRoute("/_app/projects/$projectId/settings")({
  beforeLoad: guardSection("settings"),
  component: RouteComponent,
})

const avatarColors = ["#0E7490", "#A8326B", "#D97706", "#7C3AED", "#17603C"]

function RouteComponent() {
  const { projectId } = Route.useParams()
  const project = findProject(projectId)

  const [members, setMembers] = useState<ProjectMember[]>(settingsMembers)

  const taskCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const i of backlogIssues) {
      if (i.assignee) counts[i.assignee.id] = (counts[i.assignee.id] ?? 0) + 1
    }
    return counts
  }, [])

  const addMember = ({ username, role }: { username: string; role: ProjectRole }) =>
    setMembers((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: username,
        username,
        initials: username.slice(0, 2).toUpperCase(),
        color: avatarColors[prev.length % avatarColors.length],
        role,
      },
    ])

  const changeRole = (id: string, role: ProjectRole) =>
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)))

  const removeMember = (id: string) =>
    setMembers((prev) => prev.filter((m) => m.id !== id))

  return (
    <div className="flex min-w-0 flex-col">
      <ProjectHeader
        projectName={project?.name ?? "Проєкт"}
        pageLabel="Налаштування"
        showCreate={false}
      />

      <div className="box-border flex max-w-[1080px] flex-col gap-6 px-8 py-7">
        <div>
          <h1 className="m-0 mb-1.5 font-display text-[28px] font-extrabold tracking-[-0.02em]">
            Учасники та ролі
          </h1>
          <p className="m-0 text-[15px] text-muted">
            Хто має доступ до проєкту і що може робити.
          </p>
        </div>

        <AddMemberForm
          existingUsernames={members.map((m) => m.username.toLowerCase())}
          onAdd={addMember}
        />

        <MembersTable
          members={members}
          taskCounts={taskCounts}
          onRoleChange={changeRole}
          onRemove={removeMember}
        />

        <PermissionsTable />
      </div>
    </div>
  )
}
