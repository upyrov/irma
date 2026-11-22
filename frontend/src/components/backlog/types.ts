import type { SprintStatus } from "#/components/ui/badge"
import type { Priority } from "#/components/ui/priority"
import type { TaskType } from "#/components/ui/task-type"

export type EpicColor = "purple" | "blue" | "orange" | "green"

export type Assignee = { id: string; name: string; initials: string; color: string }

export type Stage = { id: string; name: string; isDone: boolean }

export type Epic = {
  id: string
  key: string
  name: string
  color: EpicColor
}

export type Sprint = {
  id: string
  name: string
  goal: string | null
  startDate: string
  endDate: string
  status: SprintStatus
}

export type Issue = {
  id: string
  key: string
  title: string
  type: TaskType
  priority: Priority
  storyPoints: number | null
  assignee: Assignee | null
  epicId: string | null
  stageId: string
  sprintId: string | null
  done: boolean
}
