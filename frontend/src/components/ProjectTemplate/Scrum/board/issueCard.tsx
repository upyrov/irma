import { cn } from "cn"
import { Avatar, AvatarEmpty } from "#/components/ui/avatar"
import { Badge, IssueKey } from "#/components/ui/badge"
import { PriorityIcon, priorities } from "#/components/ui/priority"
import { TaskTypeIcon, taskTypes } from "#/components/ui/task-type"
import type { Epic, Issue } from "#/components/ProjectTemplate/Scrum/backlog/types"
import { ISSUE_MIME } from "#/components/ProjectTemplate/Scrum/backlog/useDropTarget"

type Props = {
  issue: Issue
  epic?: Epic
  isDragging?: boolean
  canDrag?: boolean
  showLock?: boolean
  onDragStart?: (id: string) => void
  onDragEnd?: () => void
  onOpen?: (id: string) => void
}

export const IssueCard = ({
  issue,
  epic,
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
      aria-roledescription={canDrag ? "картка, яку можна перетягнути" : undefined}
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
        "flex flex-col gap-2.5 rounded-[10px] border border-border bg-white px-3.5 py-3 text-ink outline-none hover:border-border-input hover:shadow-[0_4px_12px_rgba(22,24,29,0.08)] focus-visible:border-primary",
        canDrag ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        isDragging && "rotate-[-1.5deg] border-primary opacity-50"
      )}
    >
      <span className="text-sm font-medium leading-[1.4]">{issue.title}</span>

      {epic && (
        <Badge variant={epic.color} size="tag" className="self-start">
          {epic.name}
        </Badge>
      )}

      <span className="flex items-center gap-2">
        <TaskTypeIcon
          type={issue.type}
          role="img"
          aria-hidden={false}
          aria-label={taskTypes[issue.type].label}
          className="size-4"
        />
        <IssueKey className={cn("text-xs", issue.done && "line-through")}>
          {issue.key}
        </IssueKey>
        <span className="flex-1" />
        <PriorityIcon
          priority={issue.priority}
          role="img"
          aria-hidden={false}
          aria-label={priorities[issue.priority].label}
          className="size-4"
        />
        <Badge size="count" className="h-5 min-w-6 text-[11px]">
          {issue.storyPoints ?? "–"}
        </Badge>
        {showLock && (
          <svg
            className="size-3.5 shrink-0 text-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            role="img"
            aria-label="Статус змінює лише виконавець"
          >
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
        )}
        {issue.assignee ? (
          <Avatar
            initials={issue.assignee.initials}
            color={issue.assignee.color}
            title={issue.assignee.name}
            className="size-6 text-[9px]"
          />
        ) : (
          <AvatarEmpty className="size-6" />
        )}
      </span>
    </div>
  )
}
