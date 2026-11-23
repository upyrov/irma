import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AddProjectMemberDto, Guid } from "#/types/api"
import { projectsApi } from "../projects"
import { queryKeys } from "../queryKeys"

// ── Запити ──

export const projectsQueryOptions = queryOptions({
  queryKey: queryKeys.projects.list,
  queryFn: projectsApi.list,
})

export const projectMembersQueryOptions = (projectId: Guid) =>
  queryOptions({
    queryKey: queryKeys.projects.members(projectId),
    queryFn: () => projectsApi.members(projectId),
  })

export const projectEpicsQueryOptions = (projectId: Guid) =>
  queryOptions({
    queryKey: queryKeys.projects.epics(projectId),
    queryFn: () => projectsApi.epics(projectId),
  })

export const myRoleQueryOptions = (projectId: Guid) =>
  queryOptions({
    queryKey: queryKeys.projects.myRole(projectId),
    queryFn: () => projectsApi.myRole(projectId),
    // Роль міняється рідко — не перепитуємо на кожен рендер
    staleTime: 5 * 60_000,
  })

/** GET /api/projects — проєкти поточного користувача */
export const useProjects = () => useQuery(projectsQueryOptions)

/** Один проєкт зі списку (окремого GET /api/projects/{id} у специфікації немає) */
export const useProject = (projectId: Guid | undefined) =>
  useQuery({
    ...projectsQueryOptions,
    select: (projects) => projects.find((p) => p.id === projectId) ?? null,
    enabled: !!projectId,
  })

/** GET /api/projects/{id}/members — учасники (для Assignee у задачах) */
export const useProjectMembers = (projectId: Guid) =>
  useQuery(projectMembersQueryOptions(projectId))

/** GET /api/projects/{id}/epics */
export const useProjectEpics = (projectId: Guid) => useQuery(projectEpicsQueryOptions(projectId))

/** GET /api/projects/{id}/my-role */
export const useMyRole = (projectId: Guid) => useQuery(myRoleQueryOptions(projectId))

// ── Зміни ──

/** POST /api/projects */
export const useCreateProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.projects.list }),
  })
}

/** POST /api/projects/{id}/members — додати учасника або змінити роль */
export const useAddProjectMember = (projectId: Guid) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: AddProjectMemberDto) => projectsApi.addMember(projectId, dto),
    onSuccess: (members) => {
      queryClient.setQueryData(queryKeys.projects.members(projectId), members)
      // Учасники входять у ProjectDto.members, а роль могла змінитися і в нас самих
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.list })
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.myRole(projectId) })
    },
  })
}
