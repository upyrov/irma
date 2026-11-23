import { BoardView } from "#/components/ProjectTemplate/Scrum/board/boardView"
import { kanbanStages, type Project } from "#/tempData"

type Props = { project: Project }

/** Kanban-дошка: усі задачі проєкту, без спринтів */
export const KanbanBoard = ({ project }: Props) => {
  return (
    <BoardView
      project={project}
      stages={kanbanStages}
      sprint={null}
      pageLabel="Kanban-дошка"
    />
  )
}
