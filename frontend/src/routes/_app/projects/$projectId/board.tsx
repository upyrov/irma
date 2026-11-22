import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"
import type { Epic, Issue } from "#/components/backlog/types"
import { BoardColumn } from "#/components/board/boardColumn"
import {
  ALL,
  type BoardFilterState,
  BoardFilters,
} from "#/components/board/boardFilters"
import { BoardTitle } from "#/components/board/boardTitle"
import { ProjectHeader } from "#/components/projectHeader"
import {
  backlogEpics,
  backlogIssues,
  backlogSprints,
  currentUserId,
  kanbanStages,
  projectMembers,
  projects,
  scrumStages,
} from "#/tempData"

export const Route = createFileRoute("/_app/projects/$projectId/board")({
  component: RouteComponent,
})

const initialFilters: BoardFilterState = {
  assigneeIds: [],
  epicId: ALL,
  type: ALL,
  onlyMine: false,
}

function RouteComponent() {
  const { projectId } = Route.useParams()
  const project = projects.find((p) => String(p.id) === projectId)
  const isKanban = project?.template === "Kanban"
  const stages = isKanban ? kanbanStages : scrumStages
  const activeSprint = isKanban
    ? null
    : (backlogSprints.find((s) => s.status === "active") ?? null)

  const [issues, setIssues] = useState<Issue[]>(backlogIssues)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState(initialFilters)
  const [draggingId, setDraggingId] = useState<string | null>(null)

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
      if (activeSprint && i.sprintId !== activeSprint.id) return false
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
  }, [issues, search, filters, activeSprint])

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
        projectName={project?.name ?? "Проєкт"}
        pageLabel={isKanban ? "Kanban-дошка" : "Дошка"}
        searchPlaceholder="Пошук на дошці"
        search={search}
        onSearchChange={setSearch}
      />

      <div className="flex min-w-0 flex-col gap-[18px] px-8 py-6">
        <BoardTitle sprint={activeSprint} />

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
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
