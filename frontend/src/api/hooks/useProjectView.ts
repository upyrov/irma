import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import type { NewIssueValues } from "#/components/createIssue/types"
import type { Guid } from "#/types/api"
import {
  type Project,
  toAssignee,
  toEpic,
  toIssue,
  toProject,
  toServerPriority,
  toServerType,
  toSprint,
  toStages,
} from "../adapters"
import { useMe } from "./useAuth"
import { boardQueryOptions, stagesQueryOptions, useCreateIssue, useUpdateIssue } from "./useIssues"
import {
  projectEpicsQueryOptions,
  projectMembersQueryOptions,
  projectsQueryOptions,
} from "./useProjects"
import {
  backlogQueryOptions,
  sprintsQueryOptions,
  useCompleteSprint,
  useCreateSprint,
  useStartSprint,
} from "./useSprints"
import { teamsQueryOptions } from "./useTeams"

/** Проєкти поточного користувача у форматі UI (з назвою команди) */
export const useUiProjects = () => {
  const projects = useQuery(projectsQueryOptions)
  const teams = useQuery(teamsQueryOptions)
  const data = useMemo(
    () => projects.data?.map((p) => toProject(p, teams.data)),
    [projects.data, teams.data]
  )
  return { ...projects, data }
}

/** Один проєкт у форматі UI; `undefined` — ще вантажиться, `null` — немає доступу / не існує */
export const useUiProject = (projectId: Guid | undefined): Project | null | undefined => {
  const { data } = useUiProjects()
  if (!data) return undefined
  return data.find((p) => p.id === projectId) ?? null
}

/**
 * Усе, що потрібно сторінкам проєкту (беклог, дошки, налаштування), у форматі UI,
 * плюс дії, які пишуть у бекенд.
 */
export const useProjectView = (projectId: Guid, opts: { backlog?: boolean } = {}) => {
  const project = useUiProject(projectId)
  const isScrum = project?.template === "Scrum"

  const me = useMe()
  const stagesQ = useQuery(stagesQueryOptions(projectId))
  const membersQ = useQuery(projectMembersQueryOptions(projectId))
  const epicsQ = useQuery({
    ...projectEpicsQueryOptions(projectId),
    enabled: project?.template !== "Bug tracking",
  })
  const boardQ = useQuery(boardQueryOptions(projectId))
  const sprintsQ = useQuery({ ...sprintsQueryOptions(projectId), enabled: isScrum })
  const backlogQ = useQuery({
    ...backlogQueryOptions(projectId),
    enabled: isScrum && !!opts.backlog,
  })

  const stages = useMemo(() => toStages(stagesQ.data ?? []), [stagesQ.data])
  const doneStageIds = useMemo(
    () => new Set(stages.filter((s) => s.isDone).map((s) => s.id)),
    [stages]
  )
  const members = useMemo(
    () => (membersQ.data ?? []).map((m) => toAssignee({ id: m.userId, username: m.username })),
    [membersQ.data]
  )
  const epics = useMemo(() => (epicsQ.data ?? []).map(toEpic), [epicsQ.data])
  const sprints = useMemo(() => (sprintsQ.data ?? []).map(toSprint), [sprintsQ.data])

  /** Усі задачі проєкту, крім епіків (епіки — окремо в `epics`) */
  const issues = useMemo(
    () =>
      (boardQ.data ?? [])
        .filter((i) => i.issueType !== "Epic")
        .map((i) => toIssue(i, doneStageIds)),
    [boardQ.data, doneStageIds]
  )
  /** Беклог Scrum: задачі без спринту та задачі запланованих спринтів */
  const backlogIssues = useMemo(
    () => (backlogQ.data ?? []).map((i) => toIssue(i, doneStageIds)),
    [backlogQ.data, doneStageIds]
  )

  const createMutation = useCreateIssue(projectId)
  const updateMutation = useUpdateIssue(projectId)
  const createSprint = useCreateSprint(projectId)
  const startSprint = useStartSprint(projectId)
  const completeSprint = useCompleteSprint(projectId)

  const createIssue = (values: NewIssueValues) =>
    createMutation.mutate({
      title: values.title,
      description: values.description,
      issueType: toServerType(values.type),
      priority: toServerPriority(values.priority),
      storyPoints: values.storyPoints,
      assigneeId: values.assigneeId,
      stageId: values.stageId,
      sprintId: values.sprintId,
      epicId: values.epicId,
    })

  const moveToStage = (issueId: Guid, stageId: Guid) =>
    updateMutation.mutate({ issueId, dto: { stageId } })

  const moveToSprint = (issueId: Guid, sprintId: Guid | null) =>
    updateMutation.mutate({ issueId, dto: { sprintId } })

  const queries = [stagesQ, membersQ, boardQ, ...(isScrum ? [sprintsQ] : [])]
  const error =
    queries.find((q) => q.error)?.error ??
    createMutation.error ??
    updateMutation.error ??
    createSprint.error ??
    startSprint.error ??
    completeSprint.error ??
    null

  return {
    project,
    currentUserId: me.data?.id,
    stages,
    members,
    epics,
    sprints,
    issues,
    backlogIssues,
    isLoading: project === undefined || queries.some((q) => q.isPending),
    error,
    createIssue,
    moveToStage,
    moveToSprint,
    createSprint,
    startSprint,
    completeSprint,
  }
}

export type ProjectView = ReturnType<typeof useProjectView>
