import { backlogSprints, type Project, scrumStages } from "#/tempData"
import { BoardView } from "./board/boardView"

type Props = { project: Project }

/** Scrum-дошка: лише задачі активного спринту */
export const ScrumBoard = ({ project }: Props) => {
  const activeSprint = backlogSprints.find((s) => s.status === "active") ?? null

  if (!activeSprint) {
    return (
      <div className="flex flex-col gap-2 px-8 py-7">
        <h1 className="m-0 font-display text-[28px] font-extrabold tracking-[-0.02em]">
          Немає активного спринту
        </h1>
        <p className="m-0 text-sm text-muted">
          Запустіть спринт у беклозі, щоб побачити його задачі на дошці.
        </p>
      </div>
    )
  }

  return (
    <BoardView
      project={project}
      stages={scrumStages}
      sprint={activeSprint}
      pageLabel="Дошка"
    />
  )
}
