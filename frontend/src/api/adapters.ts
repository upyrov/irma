// Перетворення DTO бекенду → типи, з якими працюють компоненти (UI).
// Компоненти писалися під моки (`Issue`, `Sprint`, `Stage`…), тож тут — один місток між ними.
import type {
  Assignee,
  Epic,
  EpicColor,
  Issue,
  Sprint,
  Stage,
} from "#/components/ProjectTemplate/Scrum/backlog/types"
import type { ProjectMember } from "#/components/ProjectTemplate/Scrum/settings/types"
import type { Priority as UiPriority } from "#/components/ui/priority"
import type { TaskType } from "#/components/ui/task-type"
import type {
  BoardIssueDto,
  Guid,
  Priority,
  ProjectDto,
  ProjectMemberDto,
  ProjectTemplate,
  SprintDto,
  StageDto,
  TeamDto,
  UserDto,
} from "#/types/api"

// ── Шаблони ──

/** Назва шаблону в UI (бекенд: "BugTracking") */
export type UiTemplate = "Scrum" | "Kanban" | "Bug tracking"

export const toUiTemplate = (t: ProjectTemplate): UiTemplate =>
  t === "BugTracking" ? "Bug tracking" : t

// ── Кольори та ініціали ──

const palette = [
  "var(--color-primary)",
  "#B4441C",
  "var(--color-success)",
  "var(--color-epic)",
  "#0E7490",
  "#A8326B",
  "#D97706",
  "#7C3AED",
]

/** Стабільний колір за id: той самий користувач / проєкт завжди одного кольору */
export const colorFor = (id: string) => {
  let hash = 0
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) | 0
  return palette[Math.abs(hash) % palette.length]
}

/** «artem.b» → «AB», «olena» → «OL» */
export const initialsOf = (username: string) => {
  const parts = username.split(/[.\s_-]+/).filter(Boolean)
  const letters = parts.length >= 2 ? parts[0][0] + parts[1][0] : username.slice(0, 2)
  return letters.toUpperCase()
}

/**
 * Префікс ключів задач — так само, як рахує бекенд (IssueService.GetProjectPrefix):
 * перші 4 літери назви у верхньому регістрі, доповнені «X».
 */
export const projectKeyOf = (name: string) => {
  const letters = [...name].filter((ch) => /\p{L}/u.test(ch)).join("").toUpperCase()
  return letters.slice(0, 4).padEnd(4, "X")
}

// ── Користувачі ──

export const toAssignee = (u: UserDto): Assignee => ({
  id: u.id,
  name: u.username,
  initials: initialsOf(u.username),
  color: colorFor(u.id),
})

const roleToUi = { Owner: "owner", Admin: "admin", Member: "member", Viewer: "viewer" } as const
const roleFromUi = { owner: "Owner", admin: "Admin", member: "Member", viewer: "Viewer" } as const

export const toUiRole = (r: ProjectMemberDto["role"]) => roleToUi[r]
export const toServerRole = (r: ProjectMember["role"]) => roleFromUi[r]

export const toProjectMember = (m: ProjectMemberDto): ProjectMember => ({
  ...toAssignee({ id: m.userId, username: m.username }),
  username: m.username,
  role: toUiRole(m.role),
})

// ── Проєкти ──

export type Project = {
  id: Guid
  key: string
  name: string
  team: string
  teamId: Guid
  template: UiTemplate
  description: string
  stat: string
  color: string
  members: { id: Guid; initials: string; color: string }[]
}

const membersLabel = (n: number) => {
  const mod10 = n % 10
  const mod100 = n % 100
  const word =
    mod10 === 1 && mod100 !== 11
      ? "учасник"
      : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
        ? "учасники"
        : "учасників"
  return `${n} ${word}`
}

export const toProject = (p: ProjectDto, teams: TeamDto[] = []): Project => ({
  id: p.id,
  key: projectKeyOf(p.name),
  name: p.name,
  team: teams.find((t) => t.id === p.teamId)?.name ?? "",
  teamId: p.teamId,
  template: toUiTemplate(p.template),
  description: p.description ?? "",
  stat: membersLabel(p.members.length),
  color: colorFor(p.id),
  members: p.members.map((m) => ({
    id: m.userId,
    initials: initialsOf(m.username),
    color: colorFor(m.userId),
  })),
})

// ── Колонки, спринти, задачі ──

/** Остання колонка (за order) — «готово» */
export const toStages = (stages: StageDto[]): Stage[] => {
  const sorted = [...stages].sort((a, b) => a.order - b.order)
  return sorted.map((s, i) => ({
    id: s.id,
    name: s.name,
    key: s.name.trim().toLowerCase(),
    isDone: i === sorted.length - 1,
  }))
}

const sprintStatus = { Planned: "planned", Active: "active", Closed: "closed" } as const

export const toSprint = (s: SprintDto): Sprint => ({
  id: s.id,
  name: s.name,
  goal: s.goal,
  startDate: s.startDate,
  endDate: s.endDate,
  status: sprintStatus[s.status],
})

const priorityToUi: Record<Priority, UiPriority> = {
  Highest: "highest",
  High: "high",
  Medium: "medium",
  Low: "low",
  Lowest: "lowest",
}
const priorityFromUi = Object.fromEntries(
  Object.entries(priorityToUi).map(([k, v]) => [v, k])
) as Record<UiPriority, Priority>

export const toServerPriority = (p: UiPriority) => priorityFromUi[p]

const typeToUi = { Epic: "epic", Story: "story", Task: "task", Bug: "bug" } as const
const typeFromUi = { epic: "Epic", story: "Story", task: "Task", bug: "Bug" } as const

export const toServerType = (t: TaskType) => typeFromUi[t as keyof typeof typeFromUi]

export const toUiPriority = (p: Priority): UiPriority => priorityToUi[p]
export const toUiType = (t: BoardIssueDto["issueType"]) => typeToUi[t] as TaskType

export const toIssue = (i: BoardIssueDto, doneStageIds: Set<Guid>): Issue => ({
  id: i.id,
  key: i.issueKey,
  title: i.title,
  type: typeToUi[i.issueType] as TaskType,
  priority: priorityToUi[i.priority],
  storyPoints: i.storyPoints,
  assignee: i.assignee ? toAssignee(i.assignee) : null,
  epicId: i.epicId,
  stageId: i.stageId,
  sprintId: i.sprintId,
  done: doneStageIds.has(i.stageId),
  createdAt: i.createdAt,
})

const epicColors: EpicColor[] = ["purple", "blue", "orange", "green"]

export const toEpic = (e: BoardIssueDto, index: number): Epic => ({
  id: e.id,
  key: e.issueKey,
  name: e.title,
  color: epicColors[index % epicColors.length],
})
