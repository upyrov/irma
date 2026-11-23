import { cn } from "cn"
import { Clock } from "lucide-react"
import { timeAgo } from "#/components/ProjectTemplate/Scrum/backlog/format"
import type { Issue } from "#/components/ProjectTemplate/Scrum/backlog/types"
import { ISSUE_MIME } from "#/components/ProjectTemplate/Scrum/backlog/useDropTarget"
import { Avatar } from "#/components/ui/avatar"
import { IssueKey } from "#/components/ui/badge"
import { PriorityBadge } from "#/components/ui/priority"
import { TaskTypeIcon, taskTypes } from "#/components/ui/task-type"

type Props = {
  issue: Issue
  isDragging?: boolean
  canDrag?: boolean
  showLock?: boolean
  onDragStart?: (id: string) => void
  onDragEnd?: () => void
  onOpen?: (id: string) => void
}

export const BugCard = ({
  issue,
  isDragging,
  canDrag = true,
  showLock = !canDrag,
  onDragStart,
  onDragEnd,
  onOpen,
}: Props) => {
  return (
    // biome-ignore lint/a11y/useSemanticElements: картка перетягується, тож не <button>
    <div
      role="button"
      tabIndex={0}
      draggable={canDrag}
      title={showLock ? "Статус може змінити лише виконавець або адміністратор" : undefined}
      onDragStart={(e) => {
        if (!canDrag) return e.preventDefault()
        e.dataTransfer.setData(ISSUE_MIME, issue.id)
        e.dataTransfer.effectAllowed = "move"
        onDragStart?.(issue.id)
      }}
      onDragEnd={onDragEnd}
      onClick={() => onOpen?.(issue.id)}
      onKeyDown={(e) => e.key === "Enter" && onOpen?.(issue.id)}
      className={cn(
        "flex flex-col gap-2.5 rounded-[10px] border border-border bg-white px-3.5 py-3 text-ink shadow-[0_1px_2px_rgba(22,24,29,0.06)] outline-none hover:border-border-input focus-visible:border-primary",
        canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        isDragging && "rotate-[-1.5deg] border-primary opacity-50"
      )}
    >
      <span className="flex items-center gap-2">
        <TaskTypeIcon
          type={issue.type}
          role="img"
          aria-hidden={false}
          aria-label={taskTypes[issue.type].label}
          className="size-4"
        />
        <IssueKey className={cn("text-xs", issue.done && "line-through")}>{issue.key}</IssueKey>
        <span className="flex-1" />
        <PriorityBadge priority={issue.priority} />
      </span>

      <span className="text-sm font-medium leading-[1.4]">{issue.title}</span>

      <span className="flex items-center gap-2 text-xs text-muted">
        <Clock aria-hidden="true" className="size-3.5" />
        <span className="flex-1">{issue.createdAt ? timeAgo(issue.createdAt) : "—"}</span>
        {issue.assignee ? (
          <Avatar
            initials={issue.assignee.initials}
            color={issue.assignee.color}
            title={issue.assignee.name}
            className="size-6 text-[9px]"
          />
        ) : (
          <span className="flex h-6 items-center rounded-full border border-dashed border-subtle px-2 text-[11px] font-semibold">
            не призначено
          </span>
        )}
      </span>
    </div>
  )
}
