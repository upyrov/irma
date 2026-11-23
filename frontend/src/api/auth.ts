import type { UserDto, UserLoginDto, UserRegisterDto } from "#/types/api"
import { http } from "./client"

export const authApi: {
  register: (dto: UserRegisterDto) => Promise<UserDto>
  login: (dto: UserLoginDto) => Promise<UserDto>
  logout: () => Promise<void>
  me: () => Promise<UserDto>
} = {
  register: (dto: UserRegisterDto) =>
    http.post("/api/auth/register", dto).then(() => authApi.me()),

  login: (dto: UserLoginDto) =>
    http.post("/api/auth/login", dto).then(() => authApi.me()),

  logout: () => http.post<void>("/api/auth/logout"),

  me: () => http.get<UserDto>("/api/auth/me"),
}
