import type {
  BoardIssueDto,
  CommentCreateDto,
  CommentDto,
  Guid,
  IssueCreateDto,
  IssueDto,
  IssueUpdateDto,
  StageDto,
  UserDto,
} from "#/types/api"
import { http, USE_MOCKS } from "./client"
import {
  ALL_ROLES,
  addIssue,
  clone,
  db,
  delay,
  EDITORS,
  fail,
  findOr404,
  newId,
  requireProjectRole,
  toIssueDto,
  toUserDto,
} from "./mock/db"

const findIssue = (issueId: Guid) => findOr404(db.issues, (i) => i.id === issueId, "Задачу")

const validateRefs = (
  projectId: Guid,
  refs: { stageId?: Guid; sprintId?: Guid | null; epicId?: Guid | null; assigneeId?: Guid | null }
) => {
  if (refs.stageId && !db.stages.some((s) => s.id === refs.stageId && s.projectId === projectId))
    fail(400, "Колонка не з цього проєкту")
  if (refs.sprintId) {
    const sprint = db.sprints.find((s) => s.id === refs.sprintId && s.projectId === projectId)
    if (!sprint) fail(400, "Спринт не з цього проєкту")
    if (sprint?.status === "Closed") fail(409, "Не можна додати задачу в закритий спринт")
  }
  if (
    refs.epicId &&
    !db.issues.some((i) => i.id === refs.epicId && i.projectId === projectId && i.issueType === "Epic")
  )
    fail(400, "Епік не знайдено в цьому проєкті")
  if (refs.assigneeId) {
    const project = db.projects.find((p) => p.id === projectId)
    if (!project?.members.some((m) => m.userId === refs.assigneeId))
      fail(400, "Виконавець не учасник проєкту")
  }
}

const toServerUpdate = (dto: IssueUpdateDto) => {
  const { sprintId, epicId, assigneeId, ...rest } = dto
  return {
    ...rest,
    ...(sprintId === null ? { clearSprint: true } : sprintId !== undefined && { sprintId }),
    ...(epicId === null ? { clearEpic: true } : epicId !== undefined && { epicId }),
    ...(assigneeId === null
      ? { clearAssignee: true }
      : assigneeId !== undefined && { assigneeId }),
  }
}

const mock = {
  async stages(projectId: Guid): Promise<StageDto[]> {
    await delay()
    requireProjectRole(projectId, ALL_ROLES)
    return clone(db.stages.filter((s) => s.projectId === projectId).sort((a, b) => a.order - b.order))
  },

  async board(projectId: Guid): Promise<BoardIssueDto[]> {
    await delay()
    const { project } = requireProjectRole(projectId, ALL_ROLES)
    const active = db.sprints.find((s) => s.projectId === projectId && s.status === "Active")
    if (project.template === "Scrum" && !active) return []

    return db.issues
      .filter(
        (i) =>
          i.projectId === projectId &&
          i.issueType !== "Epic" &&
          (project.template !== "Scrum" || i.sprintId === active?.id)
      )
      .map((i) => ({
        id: i.id,
        issueKey: i.issueKey,
        title: i.title,
        issueType: i.issueType,
        priority: i.priority,
        storyPoints: i.storyPoints,
        stageId: i.stageId,
        sprintId: i.sprintId,
        epicId: i.epicId,
        createdAt: i.createdAt,
        assignee: toUserDto(db.users.find((u) => u.id === i.assigneeId)),
      }))
  },

  async create(dto: IssueCreateDto): Promise<IssueDto> {
    await delay()
    const stage = findOr404(db.stages, (s) => s.id === dto.stageId, "Колонку")
    requireProjectRole(stage.projectId, EDITORS)
    const title = dto.title.trim()
    if (!title) fail(400, "Вкажіть назву задачі")
    if (dto.storyPoints !== null && dto.storyPoints < 0) fail(400, "Story points не можуть бути від'ємними")
    validateRefs(stage.projectId, dto)

    const issue = addIssue({ ...dto, title, projectId: stage.projectId })
    return toIssueDto(issue)
  },

  async get(issueId: Guid): Promise<IssueDto> {
    await delay()
    const issue = findIssue(issueId)
    requireProjectRole(issue.projectId, ALL_ROLES)
    return toIssueDto(issue)
  },

  async update(issueId: Guid, dto: IssueUpdateDto): Promise<IssueDto> {
    await delay(150)
    const issue = findIssue(issueId)
    const { user, role } = requireProjectRole(issue.projectId, EDITORS)
    const someoneElses = !!issue.assigneeId && issue.assigneeId !== user.id
    if (role === "Member" && someoneElses) {
      if (dto.stageId !== undefined && dto.stageId !== issue.stageId)
        fail(403, "Статус може змінити лише виконавець або адміністратор")
      if (dto.assigneeId !== undefined && dto.assigneeId !== issue.assigneeId)
        fail(403, "Не можна перепризначити чужу задачу")
    }
    if (dto.title !== undefined && !dto.title.trim()) fail(400, "Назва не може бути порожньою")
    validateRefs(issue.projectId, dto)
    if (dto.epicId && dto.epicId === issue.id) fail(400, "Задача не може бути власним епіком")

    for (const [key, value] of Object.entries(dto)) {
      if (value !== undefined) (issue as Record<string, unknown>)[key] = value
    }
    return toIssueDto(issue)
  },

  async comments(issueId: Guid): Promise<CommentDto[]> {
    await delay()
    const issue = findIssue(issueId)
    requireProjectRole(issue.projectId, ALL_ROLES)
    return db.comments
      .filter((c) => c.issueId === issueId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map(({ authorId, ...c }) =>
        clone({ ...c, author: toUserDto(db.users.find((u) => u.id === authorId)) as UserDto })
      )
  },

  async addComment(issueId: Guid, dto: CommentCreateDto): Promise<CommentDto> {
    await delay()
    const issue = findIssue(issueId)
    const { user } = requireProjectRole(issue.projectId, EDITORS)
    const text = dto.text.trim()
    if (!text) fail(400, "Коментар не може бути порожнім")
    if (text.length > 4000) fail(400, "Коментар задовгий (максимум 4000 символів)")

    const comment = {
      id: newId(),
      text,
      authorId: user.id,
      createdAt: new Date().toISOString(),
      issueId,
    }
    db.comments.push(comment)
    const { authorId: _a, ...rest } = comment
    return clone({ ...rest, author: toUserDto(user) as UserDto })
  },
}

export const issuesApi = {
  stages: (projectId: Guid) =>
    USE_MOCKS
      ? mock.stages(projectId)
      : http.get<StageDto[]>(`/api/projects/${projectId}/stages`),

  board: (projectId: Guid) =>
    USE_MOCKS
      ? mock.board(projectId)
      : http.get<BoardIssueDto[]>(`/api/projects/${projectId}/board`),

  create: (dto: IssueCreateDto) =>
    USE_MOCKS ? mock.create(dto) : http.post<IssueDto>("/api/issues", dto),

  get: (issueId: Guid) =>
    USE_MOCKS ? mock.get(issueId) : http.get<IssueDto>(`/api/issues/${issueId}`),

  update: (issueId: Guid, dto: IssueUpdateDto) =>
    USE_MOCKS
      ? mock.update(issueId, dto)
      : http.put<IssueDto>(`/api/issues/${issueId}`, toServerUpdate(dto)),

  comments: (issueId: Guid) =>
    USE_MOCKS
      ? mock.comments(issueId)
      : http.get<CommentDto[]>(`/api/issues/${issueId}/comments`),

  addComment: (issueId: Guid, dto: CommentCreateDto) =>
    USE_MOCKS
      ? mock.addComment(issueId, dto)
      : http.post<CommentDto>(`/api/issues/${issueId}/comments`, dto),
}
