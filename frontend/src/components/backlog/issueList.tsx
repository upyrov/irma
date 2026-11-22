import { cn } from "cn"
import { IssueRow } from "./issueRow"
import type { Epic, Issue } from "./types"

export type IssueDragProps = {
  draggingId: string | null
  onDragStart: (id: string) => void
  onDragEnd: () => void
  onOpen?: (id: string) => void
}

type Props = IssueDragProps & {
  issues: Issue[]
  epicsById: Record<string, Epic>
  emptyText: string
}

export const IssueList = ({
  issues,
  epicsById,
  emptyText,
  draggingId,
  onDragStart,
  onDragEnd,
  onOpen,
}: Props) => {
  if (issues.length === 0) {
    return (
      <p className="m-0 border-b border-hover px-[18px] py-4 text-sm text-muted">
        {emptyText}
      </p>
    )
  }

  return (
    <div>
      {issues.map((issue) => (
        <IssueRow
          key={issue.id}
          issue={issue}
          epic={issue.epicId ? epicsById[issue.epicId] : undefined}
          isDragging={draggingId === issue.id}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onOpen={onOpen}
        />
      ))}
    </div>
  )
}

type DropZoneProps = { visible: boolean; active: boolean; label: string }

export const DropZone = ({ visible, active, label }: DropZoneProps) => {
  if (!visible) return null
  return (
    <div
      className={cn(
        "mx-[18px] my-2 flex h-11 items-center justify-center rounded-[10px] border-2 border-dashed text-[13px] font-semibold",
        active
          ? "border-primary bg-primary-soft text-primary-hover"
          : "border-border-input text-muted"
      )}
    >
      {label}
    </div>
  )
}
