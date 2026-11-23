// Типи DTO бекенду (Irma.BLL/DTOs). Поля — camelCase, як їх серіалізує ASP.NET.
// Enum'и — рядки (на бекенді потрібен JsonStringEnumConverter).

export type Guid = string
/** ISO 8601 з часовим поясом (DateTimeOffset), напр. "2026-11-10T00:00:00+02:00" */
export type DateTimeOffset = string

// ── 1.1 Автентифікація, команди, проєкти, ролі ──

export type ProjectRole = "Owner" | "Admin" | "Member" | "Viewer"
export type ProjectTemplate = "Scrum" | "Kanban" | "BugTracking"

export type UserDto = {
  id: Guid
  username: string
}

export type UserLoginDto = {
  username: string
  password: string
}

export type UserRegisterDto = {
  username: string
  password: string
}

export type TeamDto = {
  id: Guid
  name: string
  members: UserDto[]
}

export type TeamCreateDto = {
  name: string
}

export type ProjectCreateDto = {
  name: string
  description: string | null
  teamId: Guid
  template: ProjectTemplate
}

export type ProjectDto = {
  id: Guid
  name: string
  description: string | null
  template: ProjectTemplate
  teamId: Guid
  members: UserDto[]
}

export type ProjectMemberDto = {
  userId: Guid
  username: string
  role: ProjectRole
}

export type AddProjectMemberDto = {
  /** Id користувача */
  id: Guid
  role: ProjectRole
}

// ── 1.2 Спринти (Scrum) ──

export type SprintStatus = "Planned" | "Active" | "Closed"

export type SprintCreateDto = {
  name: string
  goal: string | null
  startDate: DateTimeOffset | null
  endDate: DateTimeOffset | null
  projectId: Guid
}

export type SprintDto = {
  id: Guid
  name: string
  goal: string | null
  startDate: DateTimeOffset | null
  endDate: DateTimeOffset | null
  status: SprintStatus
  projectId: Guid
}

// ── 1.3 Етапи (колонки дошки) ──

/** Генеруються автоматично на основі шаблону проєкту */
export type StageDto = {
  id: Guid
  name: string
  order: number
  projectId: Guid
}

// ── 1.4 Задачі, епіки, коментарі ──

export type IssueType = "Epic" | "Story" | "Task" | "Bug"
export type Priority = "Highest" | "High" | "Medium" | "Low" | "Lowest"

export type IssueCreateDto = {
  title: string
  description: string | null
  issueType: IssueType
  priority: Priority
  storyPoints: number | null
  assigneeId: Guid | null
  stageId: Guid
  sprintId: Guid | null
  epicId: Guid | null
}

/**
 * Часткове оновлення: відсутнє поле — не змінюється.
 * `null` у sprintId / epicId / assigneeId — очистити (повернути в беклог, зняти епік / виконавця).
 */
export type IssueUpdateDto = Partial<{
  title: string
  description: string | null
  priority: Priority
  storyPoints: number | null
  assigneeId: Guid | null
  stageId: Guid
  sprintId: Guid | null
  epicId: Guid | null
}>

export type IssueDto = {
  id: Guid
  /** Напр. "PROJ-123" */
  issueKey: string
  title: string
  description: string | null
  issueType: IssueType
  priority: Priority
  storyPoints: number | null
  assignee: UserDto | null
  stageId: Guid
  sprintId: Guid | null
  epicId: Guid | null
  createdAt: DateTimeOffset
}

/** Полегшена картка для дошки */
export type BoardIssueDto = {
  id: Guid
  issueKey: string
  title: string
  priority: Priority
  storyPoints: number | null
  stageId: Guid
  assignee: UserDto | null
}

export type CommentCreateDto = {
  text: string
}

export type CommentDto = {
  id: Guid
  text: string
  author: UserDto
  createdAt: DateTimeOffset
  issueId: Guid
}

// ── Помилки (ASP.NET ProblemDetails) ──

export type ProblemDetails = {
  type?: string
  title?: string
  status?: number
  detail?: string
  errors?: Record<string, string[]>
}
