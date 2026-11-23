import { useMemo, useState } from "react"
import type { Epic, Issue, Sprint, Stage } from "#/components/ProjectTemplate/Scrum/backlog/types"
import { buildIssue, nextIssueKey } from "#/components/createIssue/buildIssue"
import { CreateIssueModal } from "#/components/createIssue/createIssueModal"
import type { NewIssueDefaults, NewIssueValues } from "#/components/createIssue/types"
import { ProjectHeader } from "#/components/projectHeader"
import {
  backlogEpics,
  backlogIssues,
  backlogSprints,
  currentUserId,
  projectMembers,
  type Project,
} from "#/tempData"
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
  project: Project
  stages: Stage[]
  /** Активний спринт (Scrum) — показуються лише його задачі; null — усі задачі (Kanban) */
  sprint: Sprint | null
  pageLabel: string
}

/** Спільна дошка для шаблонів: шапка, заголовок, фільтри, колонки з drag'n'drop */
export const BoardView = ({ project, stages, sprint, pageLabel }: Props) => {
  const [issues, setIssues] = useState<Issue[]>(backlogIssues)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState(initialFilters)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  // null — модалка закрита; інакше — з якими значеннями її відкрили
  const [createDefaults, setCreateDefaults] = useState<NewIssueDefaults | null>(null)

  // Scrum: за замовчуванням — у поточний спринт, щоб задача одразу зʼявилась на дошці
  const openCreate = (stageId?: string) =>
    setCreateDefaults({ stageId, sprintId: sprint?.id })

  const addIssue = (values: NewIssueValues) =>
    setIssues((prev) => [
      ...prev,
      buildIssue(values, { issues: prev, projectKey: project.key, members: projectMembers, stages }),
    ])

  const epicsById = useMemo(
    () => Object.fromEntries(backlogEpics.map((e) => [e.id, e])) as Record<string, Epic>,
    []
  )

  /** Колонка задачі; якщо такої стадії на дошці немає — перша колонка */
  const stageOf = (issue: Issue) =>
    stages.some((s) => s.id === issue.stageId) ? issue.stageId : stages[0].id

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
  }, [issues, search, filters, sprint])

  const draggingIssue = issues.find((i) => i.id === draggingId)

  const moveIssue = (issueId: string, stageId: string) => {
    const done = stages.find((s) => s.id === stageId)?.isDone ?? false
    setIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, stageId, done } : i))
    )
    setDraggingId(null)
  }

  return (
    <div className="flex min-w-0 flex-col">
      <ProjectHeader
        projectName={project.name}
        pageLabel={pageLabel}
        searchPlaceholder="Пошук на дошці"
        search={search}
        onSearchChange={setSearch}
        onCreate={() => openCreate()}
      />

      <CreateIssueModal
        open={createDefaults !== null}
        onOpenChange={(open) => !open && setCreateDefaults(null)}
        project={project}
        nextKey={nextIssueKey(issues, project.key)}
        stages={stages}
        members={projectMembers}
        currentUserId={currentUserId}
        epics={backlogEpics}
        // Kanban без спринтів — поле «Спринт» не показуємо
        sprints={sprint ? backlogSprints.filter((s) => s.status !== "closed") : undefined}
        defaults={createDefaults ?? undefined}
        onCreate={addIssue}
      />

      <div className="flex min-w-0 flex-col gap-[18px] px-8 py-6">
        <BoardTitle sprint={sprint} />

        <BoardFilters
          members={projectMembers}
          epics={backlogEpics}
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
                canDrop={!!draggingIssue && stageOf(draggingIssue) !== stage.id}
                onDropIssue={(id) => moveIssue(id, stage.id)}
                draggingId={draggingId}
                onDragStart={setDraggingId}
                onDragEnd={() => setDraggingId(null)}
                onCreate={() => openCreate(stage.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
