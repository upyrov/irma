import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"

import { buildIssue, nextIssueKey } from "#/components/createIssue/buildIssue"
import { CreateIssueModal } from "#/components/createIssue/createIssueModal"
import type { NewIssueValues } from "#/components/createIssue/types"
import { ProjectHeader } from "#/components/projectHeader"
import { findProject, guardSection } from "#/lib/projectTemplates"
import type { TaskType } from "#/components/ui/task-type"
import {
  backlogEpics,
  backlogIssues,
  backlogSprints,
  currentUserId,
  projectMembers,
  scrumStages,
} from "#/tempData"
import type { Epic, Issue } from "#/components/ProjectTemplate/Scrum/backlog/types"
import { EpicsPanel, type EpicProgress } from "#/components/ProjectTemplate/Scrum/backlog/epicsPanel"
import { ActiveSprintBanner } from "#/components/ProjectTemplate/Scrum/backlog/activeSprintBanner"
import { SprintSection } from "#/components/ProjectTemplate/Scrum/backlog/sprintSection"
import { BacklogSection } from "#/components/ProjectTemplate/Scrum/backlog/backlogSection"

export const Route = createFileRoute("/_app/projects/$projectId/backlog")({
  // Беклог є лише в Scrum: для інших шаблонів ведемо деінде ще до рендеру
  beforeLoad: guardSection("backlog"),
  component: RouteComponent,
})

function RouteComponent() {
  const { projectId } = Route.useParams()
  const project = findProject(projectId)
  const projectKey = project?.key ?? "KAI"

  const [issues, setIssues] = useState<Issue[]>(backlogIssues)
  const [search, setSearch] = useState("")
  const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

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

  const addIssue = (values: NewIssueValues) =>
    setIssues((prev) => [
      ...prev,
      buildIssue(values, { issues: prev, projectKey, members: projectMembers, stages: scrumStages }),
    ])

  /** Швидке створення внизу беклогу — лише тип і назва, решта за замовчуванням */
  const quickCreate = ({ type, title }: { type: TaskType; title: string }) =>
    addIssue({
      type,
      title,
      description: null,
      stageId: scrumStages[0].id,
      priority: "medium",
      assigneeId: null,
      epicId: selectedEpicId,
      sprintId: null,
      storyPoints: null,
    })

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
        onCreate={() => setIsCreateOpen(true)}
      />

      <CreateIssueModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        project={{
          name: project?.name ?? "Проєкт",
          key: projectKey,
          color: project?.color ?? "var(--color-primary)",
          template: project?.template ?? "Scrum",
        }}
        nextKey={nextIssueKey(issues, projectKey)}
        stages={scrumStages}
        members={projectMembers}
        currentUserId={currentUserId}
        epics={backlogEpics}
        sprints={backlogSprints.filter((s) => s.status !== "closed")}
        // Якщо зліва вибрано епік — нова задача одразу в ньому
        defaults={{ epicId: selectedEpicId ?? undefined }}
        onCreate={addIssue}
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
            onCreateIssue={quickCreate}
            {...dragProps}
          />
        </div>
      </div>
    </div>
  )
}
