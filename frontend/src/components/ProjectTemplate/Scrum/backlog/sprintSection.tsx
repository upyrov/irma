import { Pencil, Play } from "lucide-react"
import { useState } from "react"
import { Badge, SprintStatusBadge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { formatRange, issuesCount } from "./format"
import { DropZone, type IssueDragProps, IssueList } from "./issueList"
import { SectionHeader } from "./sectionHeader"
import type { Epic, Issue, Sprint } from "./types"
import { useDropTarget } from "./useDropTarget"

type Props = IssueDragProps & {
  sprint: Sprint
  issues: Issue[]
  epicsById: Record<string, Epic>
  canDrop: boolean
  onDropIssue: (issueId: string) => void
  onEdit?: () => void
  onStart?: () => void
  startHint?: string
}

export const SprintSection = ({
  sprint,
  issues,
  epicsById,
  canDrop,
  onDropIssue,
  onEdit,
  onStart,
  startHint = "Спершу завершіть активний спринт",
  ...drag
}: Props) => {
  const [collapsed, setCollapsed] = useState(false)
  const { isOver, handlers } = useDropTarget(canDrop, onDropIssue)
  const totalSp = issues.reduce((sum, i) => sum + (i.storyPoints ?? 0), 0)

  return (
    <section
      aria-label={sprint.name}
      className="overflow-hidden rounded-[14px] border border-border bg-white"
      {...handlers}
    >
      <SectionHeader
        title={sprint.name}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      >
        <SprintStatusBadge status={sprint.status} />
        <span className="text-[13px] text-muted">
          {formatRange(sprint.startDate, sprint.endDate)} ·{" "}
          {issuesCount(issues.length)}
        </span>
        <span className="flex-1" />
        <Badge size="count" className="px-2">
          {totalSp} SP
        </Badge>
        <Button
          variant="secondary"
          size="icon"
          aria-label="Редагувати спринт"
          onClick={onEdit}
          className="rounded-lg px-0 text-text-2"
        >
          <Pencil className="size-4" />
        </Button>
        <Button
          size="xs"
          onClick={onStart}
          disabled={!onStart}
          title={onStart ? undefined : startHint}
          className="px-3.5"
        >
          <Play className="size-3.5 fill-current" />
          Start Sprint
        </Button>
      </SectionHeader>

      {!collapsed && (
        <>
          {sprint.goal && (
            <p className="m-0 border-b border-hover bg-[#FAFBFC] px-[18px] py-2.5 text-[13px] text-text-2">
              <b>Ціль:</b> {sprint.goal}
            </p>
          )}
          <IssueList
            issues={issues}
            epicsById={epicsById}
            emptyText="Перетягніть задачі з беклогу, щоб спланувати спринт."
            {...drag}
          />
        </>
      )}

      <DropZone
        visible={canDrop}
        active={isOver}
        label={`Відпустіть, щоб додати в ${sprint.name}`}
      />
    </section>
  )
}
