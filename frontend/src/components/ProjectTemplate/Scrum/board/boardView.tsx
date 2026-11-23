import { useMemo, useState } from "react"
import type { Project } from "#/api/adapters"
import type { ProjectView } from "#/api/hooks/useProjectView"
import type { Epic, Issue, Sprint } from "#/components/ProjectTemplate/Scrum/backlog/types"
import { nextIssueKey } from "#/components/createIssue/buildIssue"
import { CreateIssueModal } from "#/components/createIssue/createIssueModal"
import type { NewIssueDefaults } from "#/components/createIssue/types"
import { IssueDetailModal } from "#/components/issueDetail/issueDetailModal"
import { ErrorBanner } from "#/components/ProjectTemplate/pageState"
import { ProjectHeader } from "#/components/projectHeader"
import { BoardColumn } from "./boardColumn"
import { ALL, type BoardFilterState, BoardFilters } from "./boardFilters"
import { BoardTitle } from "./boardTitle"

const initialFilters: BoardFilterState = {
  assigneeIds: [],
  epicId: ALL,
  type: ALL,
  onlyMine: false,
}

type Props = {
  view: ProjectView
  project: Project
  sprint: Sprint | null
  pageLabel: string
}

export const BoardView = ({ view, project, sprint, pageLabel }: Props) => {
  const { issues, stages, members, epics, sprints, currentUserId, canEdit, canChangeStatus } = view
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState(initialFilters)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [createDefaults, setCreateDefaults] = useState<NewIssueDefaults | null>(null)
  const [openIssueId, setOpenIssueId] = useState<string | null>(null)

  const openCreate = (stageId?: string) =>
    setCreateDefaults({ stageId, sprintId: sprint?.id })

  const epicsById = useMemo(
    () => Object.fromEntries(epics.map((e) => [e.id, e])) as Record<string, Epic>,
    [epics]
  )

  const stageOf = (issue: Issue) =>
    stages.some((s) => s.id === issue.stageId) ? issue.stageId : stages[0]?.id

  const visibleIssues = useMemo(() => {
    const q = search.trim().toLowerCase()
    return issues.filter((i) => {
      if (sprint && i.sprintId !== sprint.id) return false
      if (filters.onlyMine && i.assignee?.id !== currentUserId) return false
      if (
        filters.assigneeIds.length > 0 &&
        !filters.assigneeIds.includes(i.assignee?.id ?? "")
      )
        return false
      if (filters.epicId !== ALL && i.epicId !== filters.epicId) return false
      if (filters.type !== ALL && i.type !== filters.type) return false
      return (
        !q || i.title.toLowerCase().includes(q) || i.key.toLowerCase().includes(q)
      )
    })
  }, [issues, search, filters, sprint, currentUserId])

  const draggingIssue = issues.find((i) => i.id === draggingId)

  const canDrag = (issue: Issue) => canChangeStatus(issue.assignee?.id)

  const moveIssue = (issueId: string, stageId: string) => {
    const issue = issues.find((i) => i.id === issueId)
    if (issue && canDrag(issue)) view.moveToStage(issueId, stageId)
    setDraggingId(null)
  }

  const completeSprint =
    view.canManageSprints && sprint ? () => view.completeSprint.mutate(sprint.id) : undefined

  return (
    <div className="flex min-w-0 flex-col">
      <ProjectHeader
        projectName={project.name}
        pageLabel={pageLabel}
        searchPlaceholder="Пошук на дошці"
        search={search}
        onSearchChange={setSearch}
        onCreate={() => openCreate()}
        showCreate={canEdit}
      />

      <ErrorBanner error={view.error} />

      <CreateIssueModal
        open={createDefaults !== null}
        onOpenChange={(open) => !open && setCreateDefaults(null)}
        project={project}
        nextKey={nextIssueKey(issues, project.key)}
        stages={stages}
        members={members}
        currentUserId={currentUserId}
        epics={epics}
        sprints={sprint ? sprints.filter((s) => s.status !== "closed") : undefined}
        defaults={createDefaults ?? undefined}
        onCreate={view.createIssue}
      />

      <IssueDetailModal
        issueId={openIssueId}
        onClose={() => setOpenIssueId(null)}
        view={view}
        project={project}
      />

      <div className="flex min-w-0 flex-col gap-[18px] px-8 py-6">
        <BoardTitle sprint={sprint} onCompleteSprint={completeSprint} />

        <BoardFilters
          members={members}
          epics={epics}
          value={filters}
          onChange={setFilters}
        />

        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-min items-start gap-4">
            {stages.map((stage) => (
              <BoardColumn
                key={stage.id}
                stage={stage}
                issues={visibleIssues.filter((i) => stageOf(i) === stage.id)}
                epicsById={epicsById}
                canDrop={
                  !!draggingIssue && canDrag(draggingIssue) && stageOf(draggingIssue) !== stage.id
                }
                canDrag={canDrag}
                showLocks={canEdit}
                onDropIssue={(id) => moveIssue(id, stage.id)}
                draggingId={draggingId}
                onDragStart={setDraggingId}
                onDragEnd={() => setDraggingId(null)}
                onCreate={canEdit ? () => openCreate(stage.id) : undefined}
                onOpen={setOpenIssueId}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
