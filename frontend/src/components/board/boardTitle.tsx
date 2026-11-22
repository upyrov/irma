import { daysLeft, formatRange, plural } from "#/components/backlog/format"
import type { Sprint } from "#/components/backlog/types"
import { SprintStatusBadge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"

const titleClass =
  "m-0 font-display text-[28px] font-extrabold tracking-[-0.02em]"

type Props = {
  /** Активний спринт для Scrum; null — Kanban-дошка */
  sprint: Sprint | null
  onCompleteSprint?: () => void
}

export const BoardTitle = ({ sprint, onCompleteSprint }: Props) => {
  if (!sprint) {
    return (
      <div className="min-w-[260px] flex-1">
        <h1 className={`${titleClass} mb-1.5`}>Kanban-дошка</h1>
        <p className="m-0 text-sm text-muted">
          Усі неархівні задачі проєкту · без спринтів
        </p>
      </div>
    )
  }

  const left = daysLeft(sprint.endDate)
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="min-w-[260px] flex-1">
        <div className="mb-1.5 flex items-center gap-2.5">
          <h1 className={titleClass}>{sprint.name}</h1>
          <SprintStatusBadge status={sprint.status} />
        </div>
        <p className="m-0 text-sm text-muted">
          {sprint.goal && <>Ціль: {sprint.goal} · </>}
          {formatRange(sprint.startDate, sprint.endDate)} ·{" "}
          <b className="text-orange-text">
            залишилось {left} {plural(left, ["день", "дні", "днів"])}
          </b>
        </p>
      </div>
      <Button variant="secondary" size="sm" onClick={onCompleteSprint}>
        Завершити спринт
      </Button>
    </div>
  )
}
