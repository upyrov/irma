import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type {
  BoardIssueDto,
  CommentCreateDto,
  Guid,
  IssueDto,
  IssueUpdateDto,
} from "#/types/api"
import { issuesApi } from "../issues"
import { queryKeys } from "../queryKeys"

export const stagesQueryOptions = (projectId: Guid) =>
  queryOptions({
    queryKey: queryKeys.projects.stages(projectId),
    queryFn: () => issuesApi.stages(projectId),
    staleTime: 10 * 60_000,
  })

export const boardQueryOptions = (projectId: Guid) =>
  queryOptions({
    queryKey: queryKeys.projects.board(projectId),
    queryFn: () => issuesApi.board(projectId),
  })

export const issueQueryOptions = (issueId: Guid) =>
  queryOptions({
    queryKey: queryKeys.issues.detail(issueId),
    queryFn: () => issuesApi.get(issueId),
  })

export const commentsQueryOptions = (issueId: Guid) =>
  queryOptions({
    queryKey: queryKeys.issues.comments(issueId),
    queryFn: () => issuesApi.comments(issueId),
  })

export const useStages = (projectId: Guid) => useQuery(stagesQueryOptions(projectId))

export const useBoard = (projectId: Guid) => useQuery(boardQueryOptions(projectId))

export const useIssue = (issueId: Guid | undefined) =>
  useQuery({ ...issueQueryOptions(issueId ?? ""), enabled: !!issueId })

export const useComments = (issueId: Guid | undefined) =>
  useQuery({ ...commentsQueryOptions(issueId ?? ""), enabled: !!issueId })

export const useCreateIssue = (projectId: Guid) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: issuesApi.create,
    onSuccess: (issue) => {
      queryClient.setQueryData(queryKeys.issues.detail(issue.id), issue)
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.scope(projectId) })
    },
  })
}

export const useUpdateIssue = (projectId: Guid) => {
  const queryClient = useQueryClient()
  const boardKey = queryKeys.projects.board(projectId)
  const backlogKey = queryKeys.projects.backlog(projectId)

  return useMutation({
    mutationFn: ({ issueId, dto }: { issueId: Guid; dto: IssueUpdateDto }) =>
      issuesApi.update(issueId, dto),

    onMutate: async ({ issueId, dto }) => {
      const keys = [boardKey, backlogKey]
      await Promise.all(keys.map((queryKey) => queryClient.cancelQueries({ queryKey })))
      const previous = keys.map((key) => [key, queryClient.getQueryData<BoardIssueDto[]>(key)] as const)
      const patch = (c: BoardIssueDto): BoardIssueDto =>
        c.id !== issueId
          ? c
          : {
              ...c,
              ...(dto.stageId !== undefined && { stageId: dto.stageId }),
              ...(dto.sprintId !== undefined && { sprintId: dto.sprintId }),
              ...(dto.epicId !== undefined && { epicId: dto.epicId }),
              ...(dto.title !== undefined && { title: dto.title }),
              ...(dto.priority !== undefined && { priority: dto.priority }),
              ...(dto.storyPoints !== undefined && { storyPoints: dto.storyPoints }),
            }
      for (const key of keys) {
        queryClient.setQueryData<BoardIssueDto[]>(key, (cards) => cards?.map(patch))
      }
      return { previous }
    },

    onError: (_err, _vars, ctx) => {
      for (const [key, data] of ctx?.previous ?? []) {
        if (data) queryClient.setQueryData(key, data)
      }
    },

    onSuccess: (issue: IssueDto) => queryClient.setQueryData(queryKeys.issues.detail(issue.id), issue),

    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.scope(projectId) }),
  })
}

export const useAddComment = (issueId: Guid) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CommentCreateDto) => issuesApi.addComment(issueId, dto),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.comments(issueId) }),
  })
}
