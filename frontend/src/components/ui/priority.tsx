import * as React from "react"
import { cn } from "cn"

type Priority = "highest" | "high" | "medium" | "low" | "lowest"

const priorities: Record<
  Priority,
  { label: string; pill: string; icon: string; path: string }
> = {
  highest: {
    label: "Highest",
    pill: "bg-danger-bg text-danger-text",
    icon: "text-danger",
    path: "M7 12l5-5 5 5M7 18l5-5 5 5",
  },
  high: {
    label: "High",
    pill: "bg-orange-bg text-orange-text",
    icon: "text-orange",
    path: "M6 15l6-6 6 6",
  },
  medium: {
    label: "Medium",
    pill: "bg-warning-bg text-warning-text",
    icon: "text-warning",
    path: "M5 9h14M5 15h14",
  },
  low: {
    label: "Low",
    pill: "bg-primary-tint text-primary-hover",
    icon: "text-primary",
    path: "M6 9l6 6 6-6",
  },
  lowest: {
    label: "Lowest",
    pill: "bg-hover text-text-2",
    icon: "text-subtle",
    path: "M7 6l5 5 5-5M7 12l5 5 5-5",
  },
}

function PriorityBadge({
  priority,
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & { priority: Priority }) {
  const p = priorities[priority]
  return (
    <span
      data-slot="priority-badge"
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold",
        p.pill,
        className
      )}
      {...props}
    >
      {children ?? p.label}
    </span>
  )
}

function PriorityIcon({
  priority,
  className,
  ...props
}: React.ComponentProps<"svg"> & { priority: Priority }) {
  const p = priorities[priority]
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-[18px] shrink-0", p.icon, className)}
      {...props}
    >
      <path
        d={p.path}
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PriorityLabel({
  priority,
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & { priority: Priority }) {
  return (
    <span
      data-slot="priority-label"
      className={cn("flex items-center gap-1 text-xs text-text-2", className)}
      {...props}
    >
      <PriorityIcon priority={priority} />
      {children ?? priorities[priority].label}
    </span>
  )
}

export { PriorityBadge, PriorityIcon, PriorityLabel, priorities }
export type { Priority }
