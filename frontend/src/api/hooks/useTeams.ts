import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query"
import type { Guid, TeamDto } from "#/types/api"
import { queryKeys } from "../queryKeys"
import { errorMessage } from "./useAuth"
import { MIN_SEARCH_LENGTH, teamsApi } from "../teams"

export const teamsQueryOptions = queryOptions({
  queryKey: queryKeys.teams.list,
  queryFn: teamsApi.list,
})

export const useTeams = () => useQuery(teamsQueryOptions)

export const useSearchUsers = (teamId: Guid, search: string) => {
  const q = search.trim()
  return useQuery({
    queryKey: queryKeys.teams.searchUsers(teamId, q),
    queryFn: () => teamsApi.searchUsers(teamId, q),
    enabled: !!teamId && q.length >= MIN_SEARCH_LENGTH,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })
}

export const useCreateTeam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: teamsApi.create,
    onSuccess: (team) => {
      queryClient.setQueryData<TeamDto[]>(queryKeys.teams.list, (old) =>
        old ? [...old.filter((t) => t.id !== team.id), team] : old,
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.teams.list })
    },
  })
}

export const useAddTeamMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ teamId, userId }: { teamId: Guid; userId: Guid }) =>
      teamsApi.addMember(teamId, userId),
    onSuccess: (team) => {
      queryClient.setQueryData<TeamDto[]>(queryKeys.teams.list, (old) =>
        old?.map((t) => (t.id === team.id ? team : t)),
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.teams.list })
      queryClient.invalidateQueries({ queryKey: ["teams", "search-users"] })
    },
  })
}

export const teamErrorMessage = (error: unknown) => errorMessage(error)
