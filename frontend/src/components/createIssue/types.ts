import type { Priority } from "#/components/ui/priority"
import type { TaskType } from "#/components/ui/task-type"

export type NewIssueValues = {
  type: TaskType
  title: string
  description: string | null
  stageId: string
  priority: Priority
  assigneeId: string | null
  epicId: string | null
  sprintId: string | null
  storyPoints: number | null
}

export type NewIssueDefaults = Partial<Pick<NewIssueValues, "type" | "stageId" | "sprintId" | "epicId">>
