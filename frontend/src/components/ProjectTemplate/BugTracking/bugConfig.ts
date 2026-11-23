import type { Issue } from "#/components/ProjectTemplate/Scrum/backlog/types"
import type { Priority } from "#/components/ui/priority"

export const bugStageMeta: Record<string, { dot: string; hint: string }> = {
  new: { dot: "bg-danger", hint: "Щойно повідомлені, ще не перевірені" },
  triage: { dot: "bg-orange", hint: "Відтворюємо і ставимо пріоритет" },
  "in progress": { dot: "bg-primary", hint: "Виправляються" },
  fixed: { dot: "bg-success", hint: "Виправлено, чекає перевірки QA" },
  verified: { dot: "bg-subtle", hint: "Перевірено й закрито" },
}

export const FIXED_STAGE_KEYS = ["fixed", "verified"]

const priorityRank: Record<Priority, number> = {
  highest: 0,
  high: 1,
  medium: 2,
  low: 3,
  lowest: 4,
}

export const byPriority = (a: Issue, b: Issue) =>
  priorityRank[a.priority] - priorityRank[b.priority] ||
  (a.createdAt ?? "").localeCompare(b.createdAt ?? "")

export type PriorityFilter = "all" | "highest" | "high" | "medium" | "low"

export const priorityFilters: { value: PriorityFilter; label: string; className: string }[] = [
  { value: "all", label: "Усі", className: "text-ink" },
  { value: "highest", label: "Highest", className: "text-danger" },
  { value: "high", label: "High", className: "text-orange" },
  { value: "medium", label: "Medium", className: "text-warning" },
  { value: "low", label: "Low та нижче", className: "text-text-2" },
]

export const matchesPriority = (priority: Priority, filter: PriorityFilter) =>
  filter === "all" ||
  (filter === "low" ? priority === "low" || priority === "lowest" : priority === filter)
