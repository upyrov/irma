import { createFileRoute } from "@tanstack/react-router"
import { KanbanBoard } from "#/components/ProjectTemplate/Kanban/KanbanBoard"
import { ScrumBoard } from "#/components/ProjectTemplate/Scrum/ScrumBoard"
import { projects } from "#/tempData"

export const Route = createFileRoute("/_app/projects/$projectId/board")({
  component: BoardPage,
})

function BoardPage() {
  const { projectId } = Route.useParams()
  // id у моках — число, а параметр маршруту — рядок
  const project = projects.find((p) => String(p.id) === projectId)

  if (!project) return <div className="p-8">Проєкт не знайдено</div>

  switch (project.template) {
    case "Scrum":
      return <ScrumBoard project={project} />
    case "Kanban":
      return <KanbanBoard project={project} />
    default:
      // TODO: BugBoard для шаблону Bug Tracking
      return (
        <div className="p-8 text-muted">
          Дошка для шаблону «{project.template}» ще в розробці
        </div>
      )
  }
}
