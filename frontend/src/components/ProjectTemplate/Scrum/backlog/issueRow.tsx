import { cn } from "cn"
import { GripVertical } from "lucide-react"
import { Avatar, AvatarEmpty } from "#/components/ui/avatar"
import { Badge, IssueKey } from "#/components/ui/badge"
import { PriorityIcon, priorities } from "#/components/ui/priority"
import { TaskTypeIcon, taskTypes } from "#/components/ui/task-type"
import type { Epic, Issue } from "./types"
import { ISSUE_MIME } from "./useDropTarget"

type Props = {
  issue: Issue
  epic?: Epic
  isDragging?: boolean
  onDragStart?: (id: string) => void
  onDragEnd?: () => void
  onOpen?: (id: string) => void
}

export const IssueRow = ({
  issue,
  epic,
  isDragging,
  onDragStart,
  onDragEnd,
  onOpen,
}: Props) => {
  return (
    // biome-ignore lint/a11y/useSemanticElements: рядок перетягується, тож не <button>
    <div
      role="button"
      tabIndex={0}
      draggable={!!onDragStart}
      onDragStart={(e) => {
        e.dataTransfer.setData(ISSUE_MIME, issue.id)
        e.dataTransfer.effectAllowed = "move"
        onDragStart?.(issue.id)
      }}
      onDragEnd={onDragEnd}
      onClick={() => onOpen?.(issue.id)}
      onKeyDown={(e) => e.key === "Enter" && onOpen?.(issue.id)}
      className={cn(
        "flex h-12 items-center gap-3 border-b border-hover bg-white px-[18px] text-ink outline-none hover:bg-[#FAFBFC] focus-visible:bg-primary-soft",
        onDragStart ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        isDragging && "opacity-40"
      )}
    >
      <GripVertical
        aria-hidden="true"
        className={cn("size-3.5 shrink-0 text-subtle", !onDragStart && "invisible")}
      />
      <TaskTypeIcon
        type={issue.type}
        role="img"
        aria-hidden={false}
        aria-label={taskTypes[issue.type].label}
      />
      <IssueKey className="w-14 shrink-0">{issue.key}</IssueKey>
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-sm",
          issue.done && "text-muted line-through"
        )}
      >
        {issue.title}
      </span>
      {epic && (
        <Badge variant={epic.color} size="tag">
          {epic.name}
        </Badge>
      )}
      <PriorityIcon
        priority={issue.priority}
        role="img"
        aria-hidden={false}
        aria-label={priorities[issue.priority].label}
      />
      <Badge size="count">{issue.storyPoints ?? "–"}</Badge>
      {issue.assignee ? (
        <Avatar
          initials={issue.assignee.initials}
          color={issue.assignee.color}
        />
      ) : (
        <AvatarEmpty />
      )}
    </div>
  )
}
