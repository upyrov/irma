import type {
  CommentDto,
  Guid,
  IssueDto,
  ProjectRole,
  ProjectTemplate,
  SprintDto,
  StageDto,
  UserDto,
} from "#/types/api"
import { ApiError } from "../client"

type MockUser = UserDto & { password: string }
type MockTeam = { id: Guid; name: string; memberIds: Guid[] }
type MockProject = {
  id: Guid
  key: string
  name: string
  description: string | null
  template: ProjectTemplate
  teamId: Guid
  members: { userId: Guid; role: ProjectRole }[]
  issueCounter: number
}
type MockIssue = Omit<IssueDto, "assignee"> & { projectId: Guid; assigneeId: Guid | null }
type MockComment = Omit<CommentDto, "author"> & { authorId: Guid }

const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`

const users: MockUser[] = [
  { id: id(1), username: "artem.b", password: "password" },
  { id: id(2), username: "olena.k", password: "password" },
  { id: id(3), username: "maksym.t", password: "password" },
  { id: id(4), username: "iryna.m", password: "password" },
  { id: id(5), username: "dmytro.s", password: "password" },
]

const teams: MockTeam[] = [
  { id: id(101), name: "Команда КАІ", memberIds: [id(1), id(2), id(3), id(4)] },
  { id: id(102), name: "Mobile Crew", memberIds: [id(1), id(5)] },
]

export const stageTemplates: Record<ProjectTemplate, string[]> = {
  Scrum: ["To Do", "In Progress", "Done"],
  Kanban: ["Backlog", "Selected", "In Progress", "Done"],
  BugTracking: ["New", "Triage", "In Progress", "Fixed", "Verified"],
}

const projects: MockProject[] = [
  {
    id: id(201),
    key: "KAI",
    name: "Jira-аналог (курсова)",
    description: "Основний вебзастосунок для керування задачами та спринтами.",
    template: "Scrum",
    teamId: id(101),
    members: [
      { userId: id(1), role: "Owner" },
      { userId: id(2), role: "Admin" },
      { userId: id(3), role: "Member" },
      { userId: id(4), role: "Viewer" },
    ],
    issueCounter: 0,
  },
  {
    id: id(202),
    key: "MOB",
    name: "Мобільний клієнт",
    description: "iOS та Android застосунок.",
    template: "Kanban",
    teamId: id(102),
    members: [
      { userId: id(1), role: "Owner" },
      { userId: id(5), role: "Member" },
    ],
    issueCounter: 0,
  },
  {
    id: id(203),
    key: "QA",
    name: "Тестування релізів",
    description: "Облік дефектів перед релізом.",
    template: "BugTracking",
    teamId: id(101),
    members: [{ userId: id(1), role: "Owner" }],
    issueCounter: 0,
  },
]

let seq = 1000
export const newId = () => id(++seq)

const stages: StageDto[] = []
export const createStagesFor = (projectId: Guid, template: ProjectTemplate) => {
  for (const [order, name] of stageTemplates[template].entries()) {
    stages.push({ id: newId(), name, order, projectId })
  }
}
for (const p of projects) createStagesFor(p.id, p.template)

const stageOf = (projectId: Guid, order: number) =>
  stages.find((s) => s.projectId === projectId && s.order === order)?.id as Guid

const sprints: SprintDto[] = [
  {
    id: id(301),
    name: "Спринт 1",
    goal: "Каркас застосунку",
    startDate: "2026-10-27T00:00:00+02:00",
    endDate: "2026-11-09T00:00:00+02:00",
    status: "Closed",
    projectId: id(201),
  },
  {
    id: id(302),
    name: "Спринт 2",
    goal: "Авторизація через HttpOnly cookie та дашборд проєктів",
    startDate: "2026-11-10T00:00:00+02:00",
    endDate: "2026-11-24T00:00:00+02:00",
    status: "Active",
    projectId: id(201),
  },
  {
    id: id(303),
    name: "Спринт 3",
    goal: "Планування спринтів і drag'n'drop у беклозі",
    startDate: null,
    endDate: null,
    status: "Planned",
    projectId: id(201),
  },
]

const issues: MockIssue[] = []
export const addIssue = (data: Omit<MockIssue, "id" | "issueKey" | "createdAt">): MockIssue => {
  const project = projects.find((p) => p.id === data.projectId) as MockProject
  project.issueCounter++
  const issue: MockIssue = {
    ...data,
    id: newId(),
    issueKey: `${project.key}-${project.issueCounter}`,
    createdAt: new Date().toISOString(),
  }
  issues.push(issue)
  return issue
}

{
  const kai = id(201)
  const base = { projectId: kai, description: null, sprintId: null, epicId: null }
  const auth = addIssue({ ...base, title: "Автентифікація", issueType: "Epic", priority: "High", storyPoints: null, assigneeId: null, stageId: stageOf(kai, 1) })
  const plan = addIssue({ ...base, title: "Scrum-планування", issueType: "Epic", priority: "Medium", storyPoints: null, assigneeId: null, stageId: stageOf(kai, 0) })
  const s2 = { ...base, sprintId: id(302) }
  addIssue({ ...s2, title: "Форма входу та реєстрації", issueType: "Story", priority: "High", storyPoints: 5, assigneeId: id(1), stageId: stageOf(kai, 2), epicId: auth.id })
  addIssue({ ...s2, title: "JWT у HttpOnly cookie", issueType: "Task", priority: "Highest", storyPoints: 3, assigneeId: id(2), stageId: stageOf(kai, 1), epicId: auth.id })
  addIssue({ ...s2, title: "Logout очищає cookie", issueType: "Bug", priority: "High", storyPoints: 1, assigneeId: id(3), stageId: stageOf(kai, 0), epicId: auth.id })
  addIssue({ ...base, sprintId: id(303), title: "Створення та редагування спринту", issueType: "Story", priority: "High", storyPoints: 5, assigneeId: id(1), stageId: stageOf(kai, 0), epicId: plan.id })
  addIssue({ ...base, title: "Burndown-графік спринту", issueType: "Story", priority: "Medium", storyPoints: 8, assigneeId: null, stageId: stageOf(kai, 0), epicId: plan.id })
  addIssue({ ...base, title: "Оновити залежності фронтенду", issueType: "Task", priority: "Lowest", storyPoints: null, assigneeId: null, stageId: stageOf(kai, 0) })

  const mob = id(202)
  const m = { projectId: mob, description: null, sprintId: null, epicId: null, storyPoints: null }
  addIssue({ ...m, title: "Push-сповіщення", issueType: "Story", priority: "Medium", assigneeId: id(5), stageId: stageOf(mob, 1) })
  addIssue({ ...m, title: "Офлайн-режим", issueType: "Story", priority: "Low", assigneeId: null, stageId: stageOf(mob, 0) })
}

const comments: MockComment[] = [
  {
    id: newId(),
    text: "Cookie треба ставити з SameSite=Lax, інакше ламається редірект після логіну.",
    authorId: id(2),
    createdAt: "2026-11-12T10:15:00+02:00",
    issueId: issues[3].id,
  },
]

export const db = { users, teams, projects, stages, sprints, issues, comments }

const SESSION_KEY = "irma-mock-session"

const readSession = (): Guid | null => {
  try {
    return globalThis.localStorage?.getItem(SESSION_KEY) ?? null
  } catch {
    return null
  }
}

let sessionUserId: Guid | null = readSession()

export const session = {
  get: () => sessionUserId,
  set: (userId: Guid | null) => {
    sessionUserId = userId
    try {
      if (userId) globalThis.localStorage?.setItem(SESSION_KEY, userId)
      else globalThis.localStorage?.removeItem(SESSION_KEY)
    } catch {
    }
  },
}

export const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms))

export const fail = (status: number, detail: string): never => {
  throw new ApiError(status, { status, title: detail, detail })
}

export const clone = <T>(value: T): T => structuredClone(value)

export const requireUser = (): MockUser => {
  const user = users.find((u) => u.id === sessionUserId)
  return user ?? fail(401, "Потрібно увійти")
}

export const toUserDto = (u: MockUser | undefined): UserDto | null =>
  u ? { id: u.id, username: u.username } : null

export const findOr404 = <T>(list: T[], pred: (x: T) => boolean, what: string): T =>
  list.find(pred) ?? fail(404, `${what} не знайдено`)

export const requireProjectRole = (projectId: Guid, roles: ProjectRole[]) => {
  const user = requireUser()
  const project = findOr404(projects, (p) => p.id === projectId, "Проєкт")
  const member =
    project.members.find((m) => m.userId === user.id) ??
    fail(403, "Ви не учасник цього проєкту")
  if (!roles.includes(member.role)) fail(403, "Недостатньо прав")
  return { user, project, role: member.role }
}

export const ALL_ROLES: ProjectRole[] = ["Owner", "Admin", "Member", "Viewer"]
export const EDITORS: ProjectRole[] = ["Owner", "Admin", "Member"]
export const MANAGERS: ProjectRole[] = ["Owner", "Admin"]

export const toIssueDto = (i: MockIssue): IssueDto => {
  const { projectId: _p, assigneeId, ...rest } = i
  return clone({ ...rest, assignee: toUserDto(users.find((u) => u.id === assigneeId)) })
}

export type { MockIssue, MockProject }
