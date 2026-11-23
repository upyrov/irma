// 2.2 Проєкти, учасники, ролі, епіки
import type {
  AddProjectMemberDto,
  Guid,
  IssueDto,
  ProjectCreateDto,
  ProjectDto,
  ProjectMemberDto,
  ProjectRole,
  UserDto,
} from "#/types/api"
import { http, USE_MOCKS } from "./client"
import {
  ALL_ROLES,
  clone,
  createStagesFor,
  db,
  delay,
  fail,
  findOr404,
  MANAGERS,
  type MockProject,
  newId,
  requireProjectRole,
  requireUser,
  toIssueDto,
  toUserDto,
} from "./mock/db"

const toProjectDto = (p: MockProject): ProjectDto =>
  clone({
    id: p.id,
    name: p.name,
    description: p.description,
    template: p.template,
    teamId: p.teamId,
    members: p.members
      .map((m) => toUserDto(db.users.find((u) => u.id === m.userId)))
      .filter((u): u is UserDto => u !== null),
  })

const toMemberDtos = (p: MockProject): ProjectMemberDto[] =>
  p.members.map((m) => ({
    userId: m.userId,
    username: db.users.find((u) => u.id === m.userId)?.username ?? "—",
    role: m.role,
  }))

/** Ключ задач з назви проєкту: «Мобільний клієнт» → «МК», «Jira-аналог» → «JA» */
const makeKey = (name: string) => {
  const letters = name
    .split(/[\s-]+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
  const base = (letters || "PRJ").slice(0, 4)
  let key = base
  for (let n = 2; db.projects.some((p) => p.key === key); n++) key = `${base}${n}`
  return key
}

const mock = {
  async list(): Promise<ProjectDto[]> {
    await delay()
    const user = requireUser()
    return db.projects
      .filter((p) => p.members.some((m) => m.userId === user.id))
      .map(toProjectDto)
  },

  async create(dto: ProjectCreateDto): Promise<ProjectDto> {
    await delay()
    const user = requireUser()
    const name = dto.name.trim()
    if (!name) fail(400, "Вкажіть назву проєкту")
    const team = findOr404(db.teams, (t) => t.id === dto.teamId, "Команду")
    if (!team.memberIds.includes(user.id)) fail(403, "Ви не учасник цієї команди")

    const project: MockProject = {
      id: newId(),
      key: makeKey(name),
      name,
      description: dto.description?.trim() || null,
      template: dto.template,
      teamId: team.id,
      members: [{ userId: user.id, role: "Owner" }],
      issueCounter: 0,
    }
    db.projects.push(project)
    createStagesFor(project.id, project.template)
    return toProjectDto(project)
  },

  async members(projectId: Guid): Promise<ProjectMemberDto[]> {
    await delay()
    const { project } = requireProjectRole(projectId, ALL_ROLES)
    return toMemberDtos(project)
  },

  async addMember(projectId: Guid, dto: AddProjectMemberDto): Promise<ProjectMemberDto[]> {
    await delay()
    const { project } = requireProjectRole(projectId, MANAGERS)
    if (dto.role === "Owner") fail(400, "Роль Owner призначити не можна")
    const team = db.teams.find((t) => t.id === project.teamId)
    if (!team?.memberIds.includes(dto.id)) fail(400, "Користувач не з команди проєкту")

    const existing = project.members.find((m) => m.userId === dto.id)
    if (existing) {
      // Той самий ендпоінт керує ролями (RBAC): існуючому учаснику міняємо роль
      if (existing.role === "Owner") fail(400, "Роль Owner змінити не можна")
      existing.role = dto.role
    } else {
      project.members.push({ userId: dto.id, role: dto.role })
    }
    return toMemberDtos(project)
  },

  async epics(projectId: Guid): Promise<IssueDto[]> {
    await delay()
    requireProjectRole(projectId, ALL_ROLES)
    return db.issues
      .filter((i) => i.projectId === projectId && i.issueType === "Epic")
      .map(toIssueDto)
  },

  async myRole(projectId: Guid): Promise<ProjectRole> {
    await delay(100)
    return requireProjectRole(projectId, ALL_ROLES).role
  },
}

export const projectsApi = {
  /** GET /api/projects — проєкти поточного користувача */
  list: () => (USE_MOCKS ? mock.list() : http.get<ProjectDto[]>("/api/projects")),

  /** POST /api/projects — створення проєкту з вибором шаблону (колонки створюються автоматично) */
  create: (dto: ProjectCreateDto) =>
    USE_MOCKS ? mock.create(dto) : http.post<ProjectDto>("/api/projects", dto),

  /** GET /api/projects/{id}/members — учасники проєкту (для Assignee у задачах) */
  members: (projectId: Guid) =>
    USE_MOCKS
      ? mock.members(projectId)
      : http.get<ProjectMemberDto[]>(`/api/projects/${projectId}/members`),

  /**
   * POST /api/projects/{id}/members — додати учасника або змінити роль (RBAC).
   * ⚠️ Що саме повертає бекенд, не визначено — заглушка віддає оновлений список учасників.
   */
  addMember: (projectId: Guid, dto: AddProjectMemberDto) =>
    USE_MOCKS
      ? mock.addMember(projectId, dto)
      : http.post<ProjectMemberDto[]>(`/api/projects/${projectId}/members`, dto),

  /** GET /api/projects/{id}/epics — усі епіки проєкту */
  epics: (projectId: Guid) =>
    USE_MOCKS ? mock.epics(projectId) : http.get<IssueDto[]>(`/api/projects/${projectId}/epics`),

  /** GET /api/projects/{id}/my-role — роль поточного користувача в проєкті */
  myRole: (projectId: Guid) =>
    USE_MOCKS
      ? mock.myRole(projectId)
      : http.get<ProjectRole>(`/api/projects/${projectId}/my-role`),
}
