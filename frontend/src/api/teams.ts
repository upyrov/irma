import type { Guid, TeamCreateDto, TeamDto, UserDto } from "#/types/api"
import { http, USE_MOCKS } from "./client"
import { clone, db, delay, fail, newId, requireUser, toUserDto } from "./mock/db"

export const MIN_SEARCH_LENGTH = 2
export const TEAM_NAME_MAX_LENGTH = 100

const toTeamDto = (t: (typeof db.teams)[number]): TeamDto =>
  clone({
    id: t.id,
    name: t.name,
    members: t.memberIds.map((uid) => toUserDto(db.users.find((u) => u.id === uid))).filter(
      (u): u is UserDto => u !== null
    ),
  })

const mock = {
  async list(): Promise<TeamDto[]> {
    await delay()
    const user = requireUser()
    return db.teams.filter((t) => t.memberIds.includes(user.id)).map(toTeamDto)
  },

  async create(dto: TeamCreateDto): Promise<TeamDto> {
    await delay()
    const user = requireUser()
    const name = dto.name.trim()
    if (!name) fail(400, "Вкажіть назву команди")
    if (name.length > TEAM_NAME_MAX_LENGTH) fail(400, `Назва команди — до ${TEAM_NAME_MAX_LENGTH} символів`)
    const team = { id: newId(), name, memberIds: [user.id] }
    db.teams.push(team)
    return toTeamDto(team)
  },

  async searchUsers(teamId: Guid, search: string): Promise<UserDto[]> {
    await delay(150)
    const me = requireUser()
    const q = search.trim().toLowerCase()
    if (q.length < MIN_SEARCH_LENGTH) return []
    const team = db.teams.find((t) => t.id === teamId) ?? fail(404, "Team not found.")
    if (!team.memberIds.includes(me.id)) fail(403, "You are not a member of this team.")
    return db.users
      .filter((u) => u.id !== me.id && !team.memberIds.includes(u.id))
      .filter((u) => u.username.toLowerCase().includes(q))
      .slice(0, 20)
      .map((u) => toUserDto(u) as UserDto)
  },

  async addMember(teamId: Guid, userId: Guid): Promise<TeamDto> {
    await delay()
    const me = requireUser()
    const team = db.teams.find((t) => t.id === teamId) ?? fail(404, "Team not found.")
    if (!team.memberIds.includes(me.id)) fail(403, "You are not a member of this team.")
    if (team.memberIds.includes(userId)) fail(409, "User is already a member of this team.")
    if (!db.users.some((u) => u.id === userId)) fail(404, "User not found.")
    team.memberIds.push(userId)
    return toTeamDto(team)
  },
}

export const teamsApi = {
  list: () => (USE_MOCKS ? mock.list() : http.get<TeamDto[]>("/api/teams")),

  create: (dto: TeamCreateDto) =>
    USE_MOCKS ? mock.create(dto) : http.post<TeamDto>("/api/teams", dto),

  searchUsers: (teamId: Guid, search: string) =>
    USE_MOCKS
      ? mock.searchUsers(teamId, search)
      : http.get<UserDto[]>(`/api/teams/${teamId}/search-users`, { query: { query: search } }),

  addMember: (teamId: Guid, userId: Guid) =>
    USE_MOCKS
      ? mock.addMember(teamId, userId)
      : http.post<TeamDto>(`/api/teams/${teamId}/members/${userId}`),
}
