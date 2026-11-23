import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Guid, SprintCreateDto } from "#/types/api"
import { queryKeys } from "../queryKeys"
import { sprintsApi } from "../sprints"

export const sprintsQueryOptions = (projectId: Guid) =>
  queryOptions({
    queryKey: queryKeys.projects.sprints(projectId),
    queryFn: () => sprintsApi.list(projectId),
  })

export const backlogQueryOptions = (projectId: Guid) =>
  queryOptions({
    queryKey: queryKeys.projects.backlog(projectId),
    queryFn: () => sprintsApi.backlog(projectId),
  })

export const useSprints = (projectId: Guid) => useQuery(sprintsQueryOptions(projectId))

export const useActiveSprint = (projectId: Guid) =>
  useQuery({
    ...sprintsQueryOptions(projectId),
    select: (sprints) => sprints.find((s) => s.status === "Active") ?? null,
  })

export const useBacklog = (projectId: Guid) => useQuery(backlogQueryOptions(projectId))

const useInvalidateProject = (projectId: Guid) => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.projects.scope(projectId) })
}

export const useCreateSprint = (projectId: Guid) => {
  const invalidate = useInvalidateProject(projectId)
  return useMutation({
    mutationFn: (dto: Omit<SprintCreateDto, "projectId">) =>
      sprintsApi.create(projectId, { ...dto, projectId }),
    onSuccess: invalidate,
  })
}

export const useStartSprint = (projectId: Guid) => {
  const invalidate = useInvalidateProject(projectId)
  return useMutation({
    mutationFn: (sprintId: Guid) => sprintsApi.start(sprintId),
    onSuccess: invalidate,
  })
}

export const useCompleteSprint = (projectId: Guid) => {
  const invalidate = useInvalidateProject(projectId)
  return useMutation({
    mutationFn: (sprintId: Guid) => sprintsApi.complete(sprintId),
    onSuccess: invalidate,
  })
}
