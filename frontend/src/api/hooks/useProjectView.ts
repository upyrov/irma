import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import type { NewIssueValues } from "#/components/createIssue/types"
import type { Guid, ProjectRole } from "#/types/api"
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
import { errorMessage, useMe } from "./useAuth"
import { boardQueryOptions, stagesQueryOptions, useCreateIssue, useUpdateIssue } from "./useIssues"
import {
  myRoleQueryOptions,
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

export const createIssueErrorMessage = (error: unknown) => errorMessage(error)

export const useUiProjects = () => {
  const projects = useQuery(projectsQueryOptions)
  const teams = useQuery(teamsQueryOptions)
  const data = useMemo(
    () => projects.data?.map((p) => toProject(p, teams.data)),
    [projects.data, teams.data]
  )
  return { ...projects, data }
}

export const useUiProject = (projectId: Guid | undefined): Project | null | undefined => {
  const { data } = useUiProjects()
  if (!data) return undefined
  return data.find((p) => p.id === projectId) ?? null
}

export const useProjectView = (projectId: Guid, opts: { backlog?: boolean } = {}) => {
  const project = useUiProject(projectId)
  const isScrum = project?.template === "Scrum"

  const me = useMe()
  const myRoleQ = useQuery(myRoleQueryOptions(projectId))
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

  const issues = useMemo(
    () =>
      (boardQ.data ?? [])
        .filter((i) => i.issueType !== "Epic")
        .map((i) => toIssue(i, doneStageIds)),
    [boardQ.data, doneStageIds]
  )
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
    createMutation.mutateAsync({
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

  const role: ProjectRole | null = myRoleQ.data ?? null
  const canEdit = role !== null && role !== "Viewer"
  const isManager = role === "Owner" || role === "Admin"
  const currentUserId = me.data?.id
  const canManageSprints = isManager
  const canChangeStatus = (assigneeId: Guid | null | undefined) =>
    canEdit && (isManager || !assigneeId || assigneeId === currentUserId)

  const queries = [stagesQ, membersQ, boardQ, ...(isScrum ? [sprintsQ] : [])]
  const error =
    queries.find((q) => q.error)?.error ??
    updateMutation.error ??
    createSprint.error ??
    startSprint.error ??
    completeSprint.error ??
    null

  return {
    project,
    currentUserId,
    role,
    canEdit,
    canManageSprints,
    canChangeStatus,
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
