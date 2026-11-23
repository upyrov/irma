import { createFileRoute } from "@tanstack/react-router"
import { BugBoard } from "#/components/ProjectTemplate/BugTracking/BugBoard"
import { KanbanBoard } from "#/components/ProjectTemplate/Kanban/KanbanBoard"
import { ScrumBoard } from "#/components/ProjectTemplate/Scrum/ScrumBoard"
import { findProject, guardSection } from "#/lib/projectTemplates"

export const Route = createFileRoute("/_app/projects/$projectId/board")({
  beforeLoad: guardSection("board"),
  component: BoardPage,
})

function BoardPage() {
  const { projectId } = Route.useParams()
  const project = findProject(projectId)

  if (!project) return <div className="p-8">Проєкт не знайдено</div>

  switch (project.template) {
    case "Scrum":
      return <ScrumBoard project={project} />
    case "Kanban":
      return <KanbanBoard project={project} />
    case "Bug tracking":
      return <BugBoard project={project} />
  }
}
