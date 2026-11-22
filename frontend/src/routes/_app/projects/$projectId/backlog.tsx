import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"

import { ProjectHeader } from "#/components/projectHeader"
import type { TaskType } from "#/components/ui/task-type"
import {
  backlogEpics,
  backlogIssues,
  backlogSprints,
  projects,
} from "#/tempData"
import type { Epic, Issue } from "#/components/ProjectTemplate/Scrum/backlog/types"
import { EpicsPanel, type EpicProgress } from "#/components/ProjectTemplate/Scrum/backlog/epicsPanel"
import { ActiveSprintBanner } from "#/components/ProjectTemplate/Scrum/backlog/activeSprintBanner"
import { SprintSection } from "#/components/ProjectTemplate/Scrum/backlog/sprintSection"
import { BacklogSection } from "#/components/ProjectTemplate/Scrum/backlog/backlogSection"

export const Route = createFileRoute("/_app/projects/$projectId/backlog")({
  component: RouteComponent,
})

function RouteComponent() {
  const { projectId } = Route.useParams()
  const project = projects.find((p) => String(p.id) === projectId)
  const projectKey = project?.key ?? "KAI"

  const [issues, setIssues] = useState<Issue[]>(backlogIssues)
  const [search, setSearch] = useState("")
  const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const epicsById = useMemo(
    () => Object.fromEntries(backlogEpics.map((e) => [e.id, e])) as Record<string, Epic>,
    []
  )

  const epicProgress = useMemo(() => {
    const result: Record<string, EpicProgress> = {}
    for (const i of issues) {
      if (!i.epicId) continue
      const p = result[i.epicId] ?? { done: 0, total: 0 }
      result[i.epicId] = p
      p.total++
      if (i.done) p.done++
    }
    return result
  }, [issues])

  const visibleIssues = useMemo(() => {
    const q = search.trim().toLowerCase()
    return issues.filter(
      (i) =>
        (!selectedEpicId || i.epicId === selectedEpicId) &&
        (!q || i.title.toLowerCase().includes(q) || i.key.toLowerCase().includes(q))
    )
  }, [issues, search, selectedEpicId])

  const activeSprint = backlogSprints.find((s) => s.status === "active")
  const plannedSprints = backlogSprints.filter((s) => s.status === "planned")
  const draggingIssue = issues.find((i) => i.id === draggingId)

  const moveIssue = (issueId: string, sprintId: string | null) => {
    setIssues((prev) => prev.map((i) => (i.id === issueId ? { ...i, sprintId } : i)))
    setDraggingId(null)
  }

  const createIssue = ({ type, title }: { type: TaskType; title: string }) => {
    setIssues((prev) => {
      const nextNum =
        Math.max(0, ...prev.map((i) => Number(i.key.split("-")[1]) || 0)) + 1
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          key: `${projectKey}-${nextNum}`,
          title,
          type,
          priority: "medium",
          storyPoints: null,
          assignee: null,
          epicId: selectedEpicId,
          stageId: "todo",
          sprintId: null,
          done: false,
        },
      ]
    })
  }

  const dragProps = {
    draggingId,
    onDragStart: setDraggingId,
    onDragEnd: () => setDraggingId(null),
  }

  return (
    <div className="flex min-w-0 flex-col">
      <ProjectHeader
        projectName={project?.name ?? "Проєкт"}
        pageLabel="Беклог"
        searchPlaceholder="Пошук задач"
        search={search}
        onSearchChange={setSearch}
      />

      <div className="flex flex-wrap items-start gap-6 px-8 py-7">
        <EpicsPanel
          epics={backlogEpics}
          progress={epicProgress}
          selectedId={selectedEpicId}
          onSelect={setSelectedEpicId}
        />

        <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-5">
          <h1 className="m-0 font-display text-[28px] font-extrabold tracking-[-0.02em]">
            Беклог
          </h1>

          {activeSprint && (
            <ActiveSprintBanner
              sprint={activeSprint}
              projectId={projectId}
              issueCount={issues.filter((i) => i.sprintId === activeSprint.id).length}
            />
          )}

          {plannedSprints.map((sprint) => (
            <SprintSection
              key={sprint.id}
              sprint={sprint}
              issues={visibleIssues.filter((i) => i.sprintId === sprint.id)}
              epicsById={epicsById}
              canDrop={!!draggingIssue && draggingIssue.sprintId !== sprint.id}
              onDropIssue={(id) => moveIssue(id, sprint.id)}
              {...dragProps}
            />
          ))}

          <BacklogSection
            issues={visibleIssues.filter((i) => i.sprintId === null)}
            epicsById={epicsById}
            canDrop={!!draggingIssue && draggingIssue.sprintId !== null}
            onDropIssue={(id) => moveIssue(id, null)}
            onCreateIssue={createIssue}
            {...dragProps}
          />
        </div>
      </div>
    </div>
  )
}
