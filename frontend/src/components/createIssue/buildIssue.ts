import type { Issue } from "#/components/ProjectTemplate/Scrum/backlog/types"

export const nextIssueKey = (issues: Issue[], projectKey: string) => {
  const max = Math.max(0, ...issues.map((i) => Number(i.key.split("-")[1]) || 0))
  return `${projectKey}-${max + 1}`
}
