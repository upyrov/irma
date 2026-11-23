import type {
  BoardIssueDto,
  CommentCreateDto,
  CommentDto,
  Guid,
  IssueCreateDto,
  IssueDto,
  IssueUpdateDto,
  StageDto,
} from "#/types/api"
import { http } from "./client"

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

export const issuesApi = {
  stages: (projectId: Guid) =>
    http.get<StageDto[]>(`/api/projects/${projectId}/stages`),

  board: (projectId: Guid) =>
    http.get<BoardIssueDto[]>(`/api/projects/${projectId}/board`),

  create: (dto: IssueCreateDto) =>
    http.post<IssueDto>("/api/issues", dto),

  get: (issueId: Guid) =>
    http.get<IssueDto>(`/api/issues/${issueId}`),

  update: (issueId: Guid, dto: IssueUpdateDto) =>
    http.put<IssueDto>(`/api/issues/${issueId}`, toServerUpdate(dto)),

  comments: (issueId: Guid) =>
    http.get<CommentDto[]>(`/api/issues/${issueId}/comments`),

  addComment: (issueId: Guid, dto: CommentCreateDto) =>
    http.post<CommentDto>(`/api/issues/${issueId}/comments`, dto),
}
