import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AddProjectMemberDto, Guid } from "#/types/api"
import { projectsApi } from "../projects"
import { queryKeys } from "../queryKeys"

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
    staleTime: 5 * 60_000,
  })

export const useProjects = () => useQuery(projectsQueryOptions)

export const useProject = (projectId: Guid | undefined) =>
  useQuery({
    ...projectsQueryOptions,
    select: (projects) => projects.find((p) => p.id === projectId) ?? null,
    enabled: !!projectId,
  })

export const useProjectMembers = (projectId: Guid) =>
  useQuery(projectMembersQueryOptions(projectId))

export const useProjectEpics = (projectId: Guid) => useQuery(projectEpicsQueryOptions(projectId))

export const useMyRole = (projectId: Guid) => useQuery(myRoleQueryOptions(projectId))

export const useCreateProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.projects.list }),
  })
}

export const useAddProjectMember = (projectId: Guid) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: AddProjectMemberDto) => projectsApi.addMember(projectId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.members(projectId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.list })
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.myRole(projectId) })
    },
  })
}
