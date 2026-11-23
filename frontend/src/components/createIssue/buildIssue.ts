import type { Issue } from "#/components/ProjectTemplate/Scrum/backlog/types"

/** Ключ, який (найімовірніше) отримає нова задача: найбільший номер + 1 (KAIX-26 → KAIX-27). Справжній дає бекенд */
export const nextIssueKey = (issues: Issue[], projectKey: string) => {
  const max = Math.max(0, ...issues.map((i) => Number(i.key.split("-")[1]) || 0))
  return `${projectKey}-${max + 1}`
}
