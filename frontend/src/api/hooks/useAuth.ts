import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authApi } from "../auth"
import { ApiError } from "../client"
import { translateServerMessage } from "../errorMessages"
import { queryKeys } from "../queryKeys"

export const authKeys = queryKeys.auth

export const fetchMe = async () => {
  try {
    return await authApi.me()
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) return null
    throw e
  }
}

export const meQueryOptions = queryOptions({
  queryKey: authKeys.me,
  queryFn: fetchMe,
  retry: false,
  staleTime: 5 * 60_000,
})

export const useMe = () => useQuery(meQueryOptions)

export const useLogin = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.login,
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
    onSettled: () => {
      queryClient.setQueryData(authKeys.me, null)
      queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== "auth" })
    },
  })
}

export const errorMessage = (error: unknown) => {
  if (!error) return ""
  if (error instanceof ApiError) {
    if (error.status >= 500) return "Помилка сервера — спробуйте ще раз"
    const fieldErrors = Object.values(error.problem.errors ?? {}).flat()
    return translateServerMessage(fieldErrors[0] ?? error.message, error.status)
  }
  return "Не вдалося зʼєднатися з сервером"
}
