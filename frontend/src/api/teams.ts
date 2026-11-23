import type { Guid, TeamCreateDto, TeamDto, UserDto } from "#/types/api"
import { http } from "./client"

export const MIN_SEARCH_LENGTH = 2
export const TEAM_NAME_MAX_LENGTH = 100

export const teamsApi = {
  list: () => http.get<TeamDto[]>("/api/teams"),

  create: (dto: TeamCreateDto) =>
    http.post<TeamDto>("/api/teams", dto),

  searchUsers: (teamId: Guid, search: string) =>
    http.get<UserDto[]>(`/api/teams/${teamId}/search-users`, { query: { query: search } }),

  addMember: (teamId: Guid, userId: Guid) =>
    http.post<TeamDto>(`/api/teams/${teamId}/members/${userId}`),
}
