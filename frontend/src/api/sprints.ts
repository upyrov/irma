import type { BoardIssueDto, Guid, SprintCreateDto, SprintDto } from "#/types/api"
import { http } from "./client"

export const sprintsApi = {
  list: (projectId: Guid) =>
    http.get<SprintDto[]>(`/api/projects/${projectId}/sprints`),

  create: (projectId: Guid, dto: SprintCreateDto) =>
    http.post<SprintDto>(`/api/projects/${projectId}/sprints`, dto),

  start: (sprintId: Guid) =>
    http.put<void>(`/api/sprints/${sprintId}/start`),

  complete: (sprintId: Guid) =>
    http.put<void>(`/api/sprints/${sprintId}/complete`),

  backlog: (projectId: Guid) =>
    http.get<BoardIssueDto[]>(`/api/projects/${projectId}/backlog`),
}
