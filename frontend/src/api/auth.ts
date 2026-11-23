import type { UserDto, UserLoginDto, UserRegisterDto } from "#/types/api"
import { http, USE_MOCKS } from "./client"
import { clone, db, delay, fail, newId, requireUser, session, toUserDto } from "./mock/db"

const mock = {
  async register(dto: UserRegisterDto): Promise<UserDto> {
    await delay()
    const username = dto.username.trim()
    if (username.length < 3) fail(400, "Username має містити щонайменше 3 символи")
    if (dto.password.length < 8) fail(400, "Пароль має містити щонайменше 8 символів")
    if (db.users.some((u) => u.username.toLowerCase() === username.toLowerCase()))
      fail(409, "Користувач з таким іменем уже існує")
    const user = { id: newId(), username, password: dto.password }
    db.users.push(user)
    session.set(user.id)
    return clone(toUserDto(user) as UserDto)
  },

  async login(dto: UserLoginDto): Promise<UserDto> {
    await delay()
    const user = db.users.find(
      (u) => u.username.toLowerCase() === dto.username.trim().toLowerCase()
    )
    if (!user || user.password !== dto.password) fail(401, "Неправильний логін або пароль")
    session.set((user as UserDto).id)
    return clone(toUserDto(user) as UserDto)
  },

  async logout(): Promise<void> {
    await delay(100)
    session.set(null)
  },

  async me(): Promise<UserDto> {
    await delay(100)
    return clone(toUserDto(requireUser()) as UserDto)
  },
}

export const authApi: {
  register: (dto: UserRegisterDto) => Promise<UserDto>
  login: (dto: UserLoginDto) => Promise<UserDto>
  logout: () => Promise<void>
  me: () => Promise<UserDto>
} = {
  register: (dto: UserRegisterDto) =>
    USE_MOCKS
      ? mock.register(dto)
      : http.post("/api/auth/register", dto).then(() => authApi.me()),

  login: (dto: UserLoginDto) =>
    USE_MOCKS
      ? mock.login(dto)
      : http.post("/api/auth/login", dto).then(() => authApi.me()),

  logout: () => (USE_MOCKS ? mock.logout() : http.post<void>("/api/auth/logout")),

  me: () => (USE_MOCKS ? mock.me() : http.get<UserDto>("/api/auth/me")),
}
