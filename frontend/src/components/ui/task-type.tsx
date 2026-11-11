import * as React from "react"
import { cn } from "cn"

type TaskType = "epic" | "story" | "task" | "bug"

const taskTypes: Record<TaskType, { label: string; bg: string; path: string }> =
  {
    epic: {
      label: "Epic",
      bg: "fill-epic",
      path: "M13 5l-6 8h5l-1 6 6-8h-5z",
    },
    story: {
      label: "Story",
      bg: "fill-story",
      path: "M8 6h8v12l-4-3-4 3z",
    },
    task: {
      label: "Task",
      bg: "fill-task",
      path: "M7 12.5l3.5 3.5L17 8.5",
    },
    bug: {
      label: "Bug",
      bg: "fill-bug",
      path: "M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z",
    },
  }

function TaskTypeIcon({
  type,
  className,
  ...props
}: React.ComponentProps<"svg"> & { type: TaskType }) {
  const t = taskTypes[type]
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-[18px] shrink-0", className)}
      {...props}
    >
      <rect width="24" height="24" rx="5" className={t.bg} />
      <path
        d={t.path}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Іконка + назва типу задачі */
function TaskTypeLabel({
  type,
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & { type: TaskType }) {
  return (
    <span
      data-slot="task-type-label"
      className={cn(
        "flex items-center gap-1.5 text-[13px] text-text-2",
        className
      )}
      {...props}
    >
      <TaskTypeIcon type={type} />
      {children ?? taskTypes[type].label}
    </span>
  )
}

export { TaskTypeIcon, TaskTypeLabel, taskTypes }
export type { TaskType }
