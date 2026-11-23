import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import { toProjectMember, toServerRole } from "#/api/adapters"
import { useAddProjectMember } from "#/api/hooks/useProjects"
import { useProjectView } from "#/api/hooks/useProjectView"
import { projectMembersQueryOptions } from "#/api/hooks/useProjects"
import { useTeams } from "#/api/hooks/useTeams"
import { ProjectHeader } from "#/components/projectHeader"
import { ErrorBanner, PageState } from "#/components/ProjectTemplate/pageState"
import { AddMemberForm } from "#/components/ProjectTemplate/Scrum/settings/addMemberForm"
import { MembersTable } from "#/components/ProjectTemplate/Scrum/settings/membersTable"
import { PermissionsTable } from "#/components/ProjectTemplate/Scrum/settings/permissionsTable"
import type { ProjectRole } from "#/components/ProjectTemplate/Scrum/settings/types"
import { guardSection } from "#/lib/projectTemplates"

export const Route = createFileRoute("/_app/projects/$projectId/settings")({
  beforeLoad: guardSection("settings"),
  component: RouteComponent,
})

function RouteComponent() {
  const { projectId } = Route.useParams()
  const view = useProjectView(projectId)
  const { project, issues } = view
  const membersQ = useQuery(projectMembersQueryOptions(projectId))
  const { data: teams = [] } = useTeams()
  const addMemberMutation = useAddProjectMember(projectId)
  const [localError, setLocalError] = useState<string | null>(null)

  const members = useMemo(() => (membersQ.data ?? []).map(toProjectMember), [membersQ.data])

  const taskCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const i of issues) {
      if (i.assignee) counts[i.assignee.id] = (counts[i.assignee.id] ?? 0) + 1
    }
    return counts
  }, [issues])

  if (view.isLoading || membersQ.isPending) return <PageState loading />
  if (!project) return <PageState error={view.error} />

  // Додати можна лише когось із команди проєкту — шукаємо id за username
  const teamMembers = teams.find((t) => t.id === project.teamId)?.members ?? []

  const addMember = ({ username, role }: { username: string; role: ProjectRole }) => {
    const user = teamMembers.find((u) => u.username.toLowerCase() === username.toLowerCase())
    addMemberMutation.reset()
    if (!user) {
      setLocalError(`@${username} немає в команді проєкту — спершу додайте його на сторінці «Команди»`)
      return
    }
    setLocalError(null)
    addMemberMutation.mutate({ userId: user.id, role: toServerRole(role) })
  }

  const changeRole = (userId: string, role: ProjectRole) => {
    setLocalError(null)
    addMemberMutation.mutate({ userId, role: toServerRole(role) })
  }

  return (
    <div className="flex min-w-0 flex-col">
      <ProjectHeader projectName={project.name} pageLabel="Налаштування" showCreate={false} />

      {localError ? (
        <div role="alert" className="mx-8 mt-4 rounded-lg bg-danger-bg px-4 py-2.5 text-sm text-danger-text">
          {localError}
        </div>
      ) : (
        <ErrorBanner error={addMemberMutation.error ?? membersQ.error} />
      )}

      <div className="box-border flex max-w-[1080px] flex-col gap-6 px-8 py-7">
        <div>
          <h1 className="m-0 mb-1.5 font-display text-[28px] font-extrabold tracking-[-0.02em]">
            Учасники та ролі
          </h1>
          <p className="m-0 text-[15px] text-muted">Хто має доступ до проєкту і що може робити.</p>
        </div>

        <AddMemberForm
          existingUsernames={members.map((m) => m.username.toLowerCase())}
          onAdd={addMember}
        />

        <MembersTable members={members} taskCounts={taskCounts} onRoleChange={changeRole} />

        <PermissionsTable />
      </div>
    </div>
  )
}
