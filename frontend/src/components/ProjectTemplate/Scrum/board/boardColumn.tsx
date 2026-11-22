import { Plus } from "lucide-react"
import { DropZone } from "#/components/ProjectTemplate/Scrum/backlog/issueList"
import type { IssueDragProps } from "#/components/ProjectTemplate/Scrum/backlog/issueList"
import type { Epic, Issue, Stage } from "#/components/ProjectTemplate/Scrum/backlog/types"
import { useDropTarget } from "#/components/ProjectTemplate/Scrum/backlog/useDropTarget"
import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { IssueCard } from "./issueCard"

type Props = IssueDragProps & {
  stage: Stage
  issues: Issue[]
  epicsById: Record<string, Epic>
  canDrop: boolean
  onDropIssue: (issueId: string) => void
  onCreate?: () => void
}

export const BoardColumn = ({
  stage,
  issues,
  epicsById,
  canDrop,
  onDropIssue,
  onCreate,
  draggingId,
  onDragStart,
  onDragEnd,
  onOpen,
}: Props) => {
  const { isOver, handlers } = useDropTarget(canDrop, onDropIssue)

  return (
    <section
      aria-label={stage.name}
      className="box-border flex max-w-[360px] flex-[1_0_280px] flex-col gap-2.5 rounded-[14px] bg-column p-3"
      {...handlers}
    >
      <div className="flex items-center gap-2 px-1.5 pt-1 pb-0.5">
        <h2 className="m-0 text-xs font-bold uppercase tracking-[.06em] text-text-2">
          {stage.name}
        </h2>
        <Badge size="count" className="h-5 min-w-[22px] bg-white">
          {issues.length}
        </Badge>
      </div>

      {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          epic={issue.epicId ? epicsById[issue.epicId] : undefined}
          isDragging={draggingId === issue.id}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onOpen={onOpen}
        />
      ))}

      <DropZone
        visible={canDrop}
        active={isOver}
        label="Перемістити сюди"
        className="m-0 h-16"
      />

      <Button
        variant="ghost"
        size="xs"
        onClick={onCreate}
        className="justify-start px-2 font-medium text-text-2 hover:bg-white/60 hover:text-ink"
      >
        <Plus className="size-3.5" strokeWidth={2.2} />
        Створити задачу
      </Button>
    </section>
  )
}
