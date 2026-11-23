// 2.3 Scrum: спринти та беклог
import type { Guid, IssueDto, SprintCreateDto, SprintDto } from "#/types/api"
import { http, USE_MOCKS } from "./client"
import {
  ALL_ROLES,
  clone,
  db,
  delay,
  fail,
  findOr404,
  MANAGERS,
  newId,
  requireProjectRole,
  toIssueDto,
} from "./mock/db"

const requireScrum = (template: string) => {
  if (template !== "Scrum") fail(400, "Спринти доступні лише в проєктах Scrum")
}

const findSprint = (sprintId: Guid) => findOr404(db.sprints, (s) => s.id === sprintId, "Спринт")

const lastStageId = (projectId: Guid) =>
  db.stages.filter((s) => s.projectId === projectId).sort((a, b) => b.order - a.order)[0]?.id

const mock = {
  async list(projectId: Guid): Promise<SprintDto[]> {
    await delay()
    requireProjectRole(projectId, ALL_ROLES)
    return clone(db.sprints.filter((s) => s.projectId === projectId))
  },

  async create(projectId: Guid, dto: SprintCreateDto): Promise<SprintDto> {
    await delay()
    const { project } = requireProjectRole(projectId, MANAGERS)
    requireScrum(project.template)
    const name = dto.name.trim()
    if (!name) fail(400, "Вкажіть назву спринту")
    if (dto.startDate && dto.endDate && dto.endDate <= dto.startDate)
      fail(400, "Дата завершення має бути пізніше за дату початку")
    if (db.sprints.some((s) => s.projectId === projectId && s.name === name))
      fail(409, "Спринт з такою назвою вже існує")

    const sprint: SprintDto = {
      id: newId(),
      name,
      goal: dto.goal?.trim() || null,
      startDate: dto.startDate,
      endDate: dto.endDate,
      status: "Planned",
      projectId,
    }
    db.sprints.push(sprint)
    return clone(sprint)
  },

  async start(sprintId: Guid): Promise<SprintDto> {
    await delay()
    const sprint = findSprint(sprintId)
    requireProjectRole(sprint.projectId, MANAGERS)
    if (sprint.status !== "Planned") fail(409, "Запустити можна лише запланований спринт")
    if (db.sprints.some((s) => s.projectId === sprint.projectId && s.status === "Active"))
      fail(409, "У проєкті вже є активний спринт")

    const now = new Date()
    sprint.status = "Active"
    sprint.startDate ??= now.toISOString()
    sprint.endDate ??= new Date(now.getTime() + 14 * 86_400_000).toISOString()
    return clone(sprint)
  },

  async complete(sprintId: Guid): Promise<SprintDto> {
    await delay()
    const sprint = findSprint(sprintId)
    requireProjectRole(sprint.projectId, MANAGERS)
    if (sprint.status !== "Active") fail(409, "Завершити можна лише активний спринт")

    // Незавершені задачі (не в останній колонці) повертаються в беклог
    const doneStage = lastStageId(sprint.projectId)
    for (const issue of db.issues) {
      if (issue.sprintId === sprint.id && issue.stageId !== doneStage) issue.sprintId = null
    }
    sprint.status = "Closed"
    return clone(sprint)
  },

  async backlog(projectId: Guid): Promise<IssueDto[]> {
    await delay()
    requireProjectRole(projectId, ALL_ROLES)
    const activeIds = new Set(
      db.sprints.filter((s) => s.projectId === projectId && s.status === "Active").map((s) => s.id)
    )
    // «Без активного спринту»: беклог + запланованих спринтів; епіки окремо (/epics)
    return db.issues
      .filter(
        (i) =>
          i.projectId === projectId &&
          i.issueType !== "Epic" &&
          !(i.sprintId && activeIds.has(i.sprintId))
      )
      .map(toIssueDto)
  },
}

export const sprintsApi = {
  /** GET /api/projects/{id}/sprints — усі спринти проєкту */
  list: (projectId: Guid) =>
    USE_MOCKS
      ? mock.list(projectId)
      : http.get<SprintDto[]>(`/api/projects/${projectId}/sprints`),

  /** POST /api/projects/{id}/sprints — новий спринт (статус Planned) */
  create: (projectId: Guid, dto: SprintCreateDto) =>
    USE_MOCKS
      ? mock.create(projectId, dto)
      : http.post<SprintDto>(`/api/projects/${projectId}/sprints`, dto),

  /** PUT /api/sprints/{id}/start — запуск спринту (у проєкті лише один активний) */
  start: (sprintId: Guid) =>
    USE_MOCKS ? mock.start(sprintId) : http.put<SprintDto>(`/api/sprints/${sprintId}/start`),

  /** PUT /api/sprints/{id}/complete — завершення; незавершені задачі йдуть у беклог */
  complete: (sprintId: Guid) =>
    USE_MOCKS
      ? mock.complete(sprintId)
      : http.put<SprintDto>(`/api/sprints/${sprintId}/complete`),

  /**
   * GET /api/projects/{id}/backlog — задачі без активного спринту.
   * Включає задачі запланованих спринтів — групуй за `sprintId` на фронтенді.
   */
  backlog: (projectId: Guid) =>
    USE_MOCKS
      ? mock.backlog(projectId)
      : http.get<IssueDto[]>(`/api/projects/${projectId}/backlog`),
}
