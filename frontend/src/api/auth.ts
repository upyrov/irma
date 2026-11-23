// 2.1 Автентифікація та користувачі
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

export const authApi = {
  /** POST /api/auth/register — реєстрація нового користувача */
  register: (dto: UserRegisterDto) =>
    USE_MOCKS ? mock.register(dto) : http.post<UserDto>("/api/auth/register", dto),

  /** POST /api/auth/login — вхід; бекенд ставить JWT у HttpOnly cookie */
  login: (dto: UserLoginDto) =>
    USE_MOCKS ? mock.login(dto) : http.post<UserDto>("/api/auth/login", dto),

  /** POST /api/auth/logout — вихід, видалення cookie сесії */
  logout: () => (USE_MOCKS ? mock.logout() : http.post<void>("/api/auth/logout")),

  /** GET /api/auth/me — перевірка поточної сесії (401, якщо не залогінений) */
  me: () => (USE_MOCKS ? mock.me() : http.get<UserDto>("/api/auth/me")),
}
