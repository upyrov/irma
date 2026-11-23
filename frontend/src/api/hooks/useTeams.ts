import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { Guid } from "#/types/api"
import { queryKeys } from "../queryKeys"
import { teamsApi } from "../teams"

// ── Запити ──

export const teamsQueryOptions = queryOptions({
  queryKey: queryKeys.teams.list,
  queryFn: teamsApi.list,
})

/** GET /api/teams — команди поточного користувача */
export const useTeams = () => useQuery(teamsQueryOptions)

/** GET /api/teams/search-users — пошук стартує з 2 символів; поки вводиш, лишаються старі результати */
export const useSearchUsers = (search: string) => {
  const q = search.trim()
  return useQuery({
    queryKey: queryKeys.teams.searchUsers(q),
    queryFn: () => teamsApi.searchUsers(q),
    enabled: q.length >= 2,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

// ── Зміни ──

/** POST /api/teams */
export const useCreateTeam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: teamsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.teams.list }),
  })
}

/** POST /api/teams/{id}/members/{userId} */
export const useAddTeamMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: Guid; userId: Guid }) =>
      teamsApi.addMember(teamId, userId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.teams.list }),
  })
}
