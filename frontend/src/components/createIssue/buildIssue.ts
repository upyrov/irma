import type { Assignee, Issue, Stage } from "#/components/ProjectTemplate/Scrum/backlog/types"
import type { NewIssueValues } from "./types"

/** Наступний ключ задачі: найбільший номер серед наявних + 1 (KAI-26 → KAI-27) */
export const nextIssueKey = (issues: Issue[], projectKey: string) => {
  const max = Math.max(0, ...issues.map((i) => Number(i.key.split("-")[1]) || 0))
  return `${projectKey}-${max + 1}`
}

/**
 * Локальна задача з даних форми — поки сторінки працюють на моках.
 * З API тут буде `useCreateIssue().mutate(values)`, а ключ згенерує бекенд.
 */
export const buildIssue = (
  values: NewIssueValues,
  ctx: { issues: Issue[]; projectKey: string; members: Assignee[]; stages: Stage[] }
): Issue => ({
  id: crypto.randomUUID(),
  key: nextIssueKey(ctx.issues, ctx.projectKey),
  title: values.title,
  type: values.type,
  priority: values.priority,
  storyPoints: values.storyPoints,
  assignee: ctx.members.find((m) => m.id === values.assigneeId) ?? null,
  epicId: values.epicId,
  stageId: values.stageId,
  sprintId: values.sprintId,
  done: ctx.stages.find((s) => s.id === values.stageId)?.isDone ?? false,
  createdAt: new Date().toISOString(),
})
