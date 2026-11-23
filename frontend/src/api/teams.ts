// 2.2 Команди
import type { Guid, TeamCreateDto, TeamDto, UserDto } from "#/types/api"
import { http, USE_MOCKS } from "./client"
import { clone, db, delay, fail, findOr404, newId, requireUser, toUserDto } from "./mock/db"

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
    const team = { id: newId(), name, memberIds: [user.id] }
    db.teams.push(team)
    return toTeamDto(team)
  },

  async searchUsers(search: string): Promise<UserDto[]> {
    await delay(150)
    requireUser()
    const q = search.trim().toLowerCase()
    if (!q) return []
    return db.users
      .filter((u) => u.username.toLowerCase().includes(q))
      .slice(0, 20)
      .map((u) => toUserDto(u) as UserDto)
  },

  async addMember(teamId: Guid, userId: Guid): Promise<TeamDto> {
    await delay()
    const me = requireUser()
    const team = findOr404(db.teams, (t) => t.id === teamId, "Команду")
    if (!team.memberIds.includes(me.id)) fail(403, "Ви не учасник цієї команди")
    findOr404(db.users, (u) => u.id === userId, "Користувача")
    if (team.memberIds.includes(userId)) fail(409, "Користувач уже в команді")
    team.memberIds.push(userId)
    return toTeamDto(team)
  },
}

export const teamsApi = {
  /** GET /api/teams — команди поточного користувача */
  list: () => (USE_MOCKS ? mock.list() : http.get<TeamDto[]>("/api/teams")),

  /** POST /api/teams — створення команди (творець стає її учасником) */
  create: (dto: TeamCreateDto) =>
    USE_MOCKS ? mock.create(dto) : http.post<TeamDto>("/api/teams", dto),

  /** GET /api/teams/search-users?search= — пошук користувачів за іменем */
  searchUsers: (search: string) =>
    USE_MOCKS
      ? mock.searchUsers(search)
      : http.get<UserDto[]>("/api/teams/search-users", { query: { search } }),

  /** POST /api/teams/{id}/members/{userId} — додати користувача в команду */
  addMember: (teamId: Guid, userId: Guid) =>
    USE_MOCKS
      ? mock.addMember(teamId, userId)
      : http.post<TeamDto>(`/api/teams/${teamId}/members/${userId}`),
}
