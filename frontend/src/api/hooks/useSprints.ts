import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { Guid, SprintCreateDto } from "#/types/api"
import { queryKeys } from "../queryKeys"
import { sprintsApi } from "../sprints"

// ── Запити ──

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

/** GET /api/projects/{id}/sprints */
export const useSprints = (projectId: Guid) => useQuery(sprintsQueryOptions(projectId))

/** Активний спринт проєкту (з того самого запиту) */
export const useActiveSprint = (projectId: Guid) =>
  useQuery({
    ...sprintsQueryOptions(projectId),
    select: (sprints) => sprints.find((s) => s.status === "Active") ?? null,
  })

/** GET /api/projects/{id}/backlog — задачі без активного спринту */
export const useBacklog = (projectId: Guid) => useQuery(backlogQueryOptions(projectId))

// ── Зміни ──
// Спринти впливають на беклог і дошку, тож після змін оновлюємо всі дані проєкту.

const useInvalidateProject = (projectId: Guid) => {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.projects.scope(projectId) })
}

/** POST /api/projects/{id}/sprints */
export const useCreateSprint = (projectId: Guid) => {
  const invalidate = useInvalidateProject(projectId)
  return useMutation({
    mutationFn: (dto: Omit<SprintCreateDto, "projectId">) =>
      sprintsApi.create(projectId, { ...dto, projectId }),
    onSuccess: invalidate,
  })
}

/** PUT /api/sprints/{id}/start */
export const useStartSprint = (projectId: Guid) => {
  const invalidate = useInvalidateProject(projectId)
  return useMutation({
    mutationFn: (sprintId: Guid) => sprintsApi.start(sprintId),
    onSuccess: invalidate,
  })
}

/** PUT /api/sprints/{id}/complete — незавершені задачі повертаються в беклог */
export const useCompleteSprint = (projectId: Guid) => {
  const invalidate = useInvalidateProject(projectId)
  return useMutation({
    mutationFn: (sprintId: Guid) => sprintsApi.complete(sprintId),
    onSuccess: invalidate,
  })
}
