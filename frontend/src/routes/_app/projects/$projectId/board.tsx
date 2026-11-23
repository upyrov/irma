import { createFileRoute } from "@tanstack/react-router"
import { useProjectView } from "#/api/hooks/useProjectView"
import { BugBoard } from "#/components/ProjectTemplate/BugTracking/BugBoard"
import { KanbanBoard } from "#/components/ProjectTemplate/Kanban/KanbanBoard"
import { PageState } from "#/components/ProjectTemplate/pageState"
import { ScrumBoard } from "#/components/ProjectTemplate/Scrum/ScrumBoard"
import { guardSection } from "#/lib/projectTemplates"

export const Route = createFileRoute("/_app/projects/$projectId/board")({
  beforeLoad: guardSection("board"),
  component: BoardPage,
})

function BoardPage() {
  const { projectId } = Route.useParams()
  const view = useProjectView(projectId)
  const { project } = view

  if (view.isLoading) return <PageState loading />
  if (!project) return <PageState error={view.error} />

  switch (project.template) {
    case "Scrum":
      return <ScrumBoard view={view} project={project} />
    case "Kanban":
      return <KanbanBoard view={view} project={project} />
    case "Bug tracking":
      return <BugBoard view={view} project={project} />
  }
}
