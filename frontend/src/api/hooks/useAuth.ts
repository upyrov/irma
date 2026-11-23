import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authApi } from "../auth"
import { ApiError } from "../client"

export const authKeys = {
  me: ["auth", "me"] as const,
}

/** GET /api/auth/me, але 401 → null (не залогінений — це не помилка) */
export const fetchMe = async () => {
  try {
    return await authApi.me()
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) return null
    throw e
  }
}

export const meQueryOptions = {
  queryKey: authKeys.me,
  queryFn: fetchMe,
  retry: false,
  staleTime: 5 * 60_000,
} as const

/** Поточний користувач; `data` — null, якщо не залогінений */
export const useMe = () => useQuery(meQueryOptions)

export const useLogin = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.login,
    // Кладемо користувача в кеш — сайдбар не робитиме зайвий запит /me
    onSuccess: (user) => queryClient.setQueryData(authKeys.me, user),
  })
}

export const useRegister = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (user) => queryClient.setQueryData(authKeys.me, user),
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.logout,
    // Дані попереднього користувача не повинні лишитися в кеші
    onSettled: () => queryClient.clear(),
  })
}

/** Текст помилки для форми: повідомлення бекенду (ProblemDetails) або загальне */
export const errorMessage = (error: unknown) => {
  if (!error) return ""
  if (error instanceof ApiError) {
    const fieldErrors = Object.values(error.problem.errors ?? {}).flat()
    return fieldErrors[0] ?? error.message
  }
  return "Не вдалося зʼєднатися з сервером"
}
