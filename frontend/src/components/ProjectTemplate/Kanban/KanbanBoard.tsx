import type { Project } from "#/api/adapters"
import type { ProjectView } from "#/api/hooks/useProjectView"
import { BoardView } from "#/components/ProjectTemplate/Scrum/board/boardView"

type Props = { view: ProjectView; project: Project }

export const KanbanBoard = ({ view, project }: Props) => (
  <BoardView view={view} project={project} sprint={null} pageLabel="Kanban-дошка" />
)
