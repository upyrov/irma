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

// ── Запити ──

export const stagesQueryOptions = (projectId: Guid) =>
  queryOptions({
    queryKey: queryKeys.projects.stages(projectId),
    queryFn: () => issuesApi.stages(projectId),
    // Колонки генеруються з шаблону і майже не змінюються
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

/** GET /api/projects/{id}/stages — колонки дошки */
export const useStages = (projectId: Guid) => useQuery(stagesQueryOptions(projectId))

/** GET /api/projects/{id}/board — картки дошки */
export const useBoard = (projectId: Guid) => useQuery(boardQueryOptions(projectId))

/** GET /api/issues/{id} — деталі задачі; `issueId` undefined — модалка закрита, запиту немає */
export const useIssue = (issueId: Guid | undefined) =>
  useQuery({ ...issueQueryOptions(issueId ?? ""), enabled: !!issueId })

/** GET /api/issues/{id}/comments */
export const useComments = (issueId: Guid | undefined) =>
  useQuery({ ...commentsQueryOptions(issueId ?? ""), enabled: !!issueId })

// ── Зміни ──

/** POST /api/issues. projectId потрібен лише щоб оновити беклог / дошку цього проєкту */
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

/**
 * PUT /api/issues/{id}. Для drag'n'drop на дошці картка переїжджає одразу
 * (оптимістично), а якщо сервер відмовив — повертається назад.
 */
export const useUpdateIssue = (projectId: Guid) => {
  const queryClient = useQueryClient()
  const boardKey = queryKeys.projects.board(projectId)

  return useMutation({
    mutationFn: ({ issueId, dto }: { issueId: Guid; dto: IssueUpdateDto }) =>
      issuesApi.update(issueId, dto),

    onMutate: async ({ issueId, dto }) => {
      await queryClient.cancelQueries({ queryKey: boardKey })
      const previousBoard = queryClient.getQueryData<BoardIssueDto[]>(boardKey)
      queryClient.setQueryData<BoardIssueDto[]>(boardKey, (cards) =>
        cards?.map((c) =>
          c.id === issueId
            ? {
                ...c,
                ...(dto.stageId !== undefined && { stageId: dto.stageId }),
                ...(dto.title !== undefined && { title: dto.title }),
                ...(dto.priority !== undefined && { priority: dto.priority }),
                ...(dto.storyPoints !== undefined && { storyPoints: dto.storyPoints }),
              }
            : c
        )
      )
      return { previousBoard }
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previousBoard) queryClient.setQueryData(boardKey, ctx.previousBoard)
    },

    onSuccess: (issue: IssueDto) => queryClient.setQueryData(queryKeys.issues.detail(issue.id), issue),

    // Синхронізуємося з сервером: дошка, беклог, епіки
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.scope(projectId) }),
  })
}

/** POST /api/issues/{id}/comments */
export const useAddComment = (issueId: Guid) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dto: CommentCreateDto) => issuesApi.addComment(issueId, dto),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.comments(issueId) }),
  })
}
