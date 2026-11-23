import { cn } from "cn"
import { Plus } from "lucide-react"
import { DropZone, type IssueDragProps } from "#/components/ProjectTemplate/Scrum/backlog/issueList"
import type { Issue, Stage } from "#/components/ProjectTemplate/Scrum/backlog/types"
import { useDropTarget } from "#/components/ProjectTemplate/Scrum/backlog/useDropTarget"
import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { BugCard } from "./bugCard"
import { bugStageMeta } from "./bugConfig"

type Props = IssueDragProps & {
  stage: Stage
  issues: Issue[]
  canDrop: boolean
  onDropIssue: (issueId: string) => void
  onCreate?: () => void
  canDrag: (issue: Issue) => boolean
  showLocks?: boolean
}

export const BugColumn = ({
  stage,
  issues,
  canDrop,
  onDropIssue,
  onCreate,
  canDrag,
  showLocks = true,
  draggingId,
  onDragStart,
  onDragEnd,
  onOpen,
}: Props) => {
  const { isOver, handlers } = useDropTarget(canDrop, onDropIssue)
  const meta = bugStageMeta[stage.key]

  return (
    <section
      aria-label={stage.name}
      className="box-border flex max-w-[300px] flex-[1_0_236px] flex-col gap-2.5 rounded-[14px] bg-column p-3"
      {...handlers}
    >
      <div className="flex items-center gap-2 px-1.5 pt-1">
        <span aria-hidden="true" className={cn("size-2 rounded-full", meta?.dot ?? "bg-subtle")} />
        <h2 className="m-0 text-xs font-bold uppercase tracking-[.06em] text-text-2">{stage.name}</h2>
        <Badge size="count" className="h-5 min-w-[22px] bg-white">
          {issues.length}
        </Badge>
      </div>
      {meta && <p className="m-0 mx-1.5 text-xs text-muted">{meta.hint}</p>}

      {issues.map((issue) => (
        <BugCard
          key={issue.id}
          issue={issue}
          isDragging={draggingId === issue.id}
          canDrag={canDrag(issue)}
          showLock={showLocks && !canDrag(issue)}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onOpen={onOpen}
        />
      ))}

      <DropZone visible={canDrop} active={isOver} label="Перемістити сюди" className="m-0 h-16" />

      {onCreate && (
        <Button
          variant="ghost"
          size="xs"
          onClick={onCreate}
          className="justify-start px-2 font-medium text-text-2 hover:bg-white/60 hover:text-ink"
        >
          <Plus className="size-3.5" strokeWidth={2.2} />
          Додати баг
        </Button>
      )}
    </section>
  )
}
