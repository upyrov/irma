import type {
  AddProjectMemberDto,
  BoardIssueDto,
  Guid,
  MyRoleDto,
  ProjectCreateDto,
  ProjectDto,
  ProjectMemberDto,
  ProjectRole,
} from "#/types/api"
import { http } from "./client"

export const projectsApi = {
  list: () => http.get<ProjectDto[]>("/api/projects"),

  create: (dto: ProjectCreateDto) =>
    http.post<ProjectDto>("/api/projects", dto),

  members: (projectId: Guid) =>
    http.get<ProjectMemberDto[]>(`/api/projects/${projectId}/members`),

  addMember: (projectId: Guid, dto: AddProjectMemberDto) =>
    http.post<ProjectMemberDto>(`/api/projects/${projectId}/members`, dto),

  epics: (projectId: Guid) =>
    http.get<BoardIssueDto[]>(`/api/projects/${projectId}/epics`),

  myRole: (projectId: Guid): Promise<ProjectRole | null> =>
    http.get<MyRoleDto>(`/api/projects/${projectId}/my-role`).then((r) => r.role),
}
