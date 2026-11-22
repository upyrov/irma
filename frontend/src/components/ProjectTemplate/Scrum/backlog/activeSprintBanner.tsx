import { Link } from "@tanstack/react-router"
import { SprintStatusBadge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { daysLeft, formatRange, issuesCount, plural } from "./format"
import type { Sprint } from "./types"

type Props = {
  sprint: Sprint
  projectId: string
  issueCount: number
  onComplete?: () => void
}

export const ActiveSprintBanner = ({
  sprint,
  projectId,
  issueCount,
  onComplete,
}: Props) => {
  const left = daysLeft(sprint.endDate)
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#BFE3CD] bg-success-bg px-4 py-3.5">
      <SprintStatusBadge status="active" />
      <span className="text-[15px] font-bold">{sprint.name}</span>
      <span className="text-sm text-success-text">
        {formatRange(sprint.startDate, sprint.endDate)} · залишилось {left}{" "}
        {plural(left, ["день", "дні", "днів"])} · {issuesCount(issueCount)} на
        дошці
      </span>
      <span className="flex-1" />
      <Link
        to="/projects/$projectId/board"
        params={{ projectId }}
        className="text-sm font-semibold text-success-text hover:text-success"
      >
        Відкрити дошку
      </Link>
      <Button
        variant="secondary"
        size="xs"
        onClick={onComplete}
        className="border-success px-3.5 text-success-text hover:bg-success-bg"
      >
        Завершити спринт
      </Button>
    </div>
  )
}
