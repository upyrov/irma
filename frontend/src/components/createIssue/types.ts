import type { Priority } from "#/components/ui/priority"
import type { TaskType } from "#/components/ui/task-type"

/** Дані з форми «Нова задача» (відповідають IssueCreateDto) */
export type NewIssueValues = {
  type: TaskType
  title: string
  description: string | null
  stageId: string
  priority: Priority
  assigneeId: string | null
  epicId: string | null
  /** null — беклог */
  sprintId: string | null
  storyPoints: number | null
}

/** Початкові значення залежно від того, звідки відкрили форму */
export type NewIssueDefaults = Partial<Pick<NewIssueValues, "type" | "stageId" | "sprintId" | "epicId">>
