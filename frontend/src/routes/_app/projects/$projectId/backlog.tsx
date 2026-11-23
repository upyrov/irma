import { createFileRoute } from "@tanstack/react-router"
import { useMemo, useState } from "react"

import { createIssueErrorMessage, useProjectView } from "#/api/hooks/useProjectView"
import { nextIssueKey } from "#/components/createIssue/buildIssue"
import { CreateIssueModal } from "#/components/createIssue/createIssueModal"
import type { NewIssueDefaults } from "#/components/createIssue/types"
import { ErrorBanner, PageState } from "#/components/ProjectTemplate/pageState"
import { ProjectHeader } from "#/components/projectHeader"
import { guardSection } from "#/lib/projectTemplates"
import type { TaskType } from "#/components/ui/task-type"
import type { Epic } from "#/components/ProjectTemplate/Scrum/backlog/types"
import { EpicsPanel, type EpicProgress } from "#/components/ProjectTemplate/Scrum/backlog/epicsPanel"
import { ActiveSprintBanner } from "#/components/ProjectTemplate/Scrum/backlog/activeSprintBanner"
import { IssueDetailModal } from "#/components/issueDetail/issueDetailModal"
import { SprintSection } from "#/components/ProjectTemplate/Scrum/backlog/sprintSection"
import { BacklogSection } from "#/components/ProjectTemplate/Scrum/backlog/backlogSection"

export const Route = createFileRoute("/_app/projects/$projectId/backlog")({
  beforeLoad: guardSection("backlog"),
  component: RouteComponent,
})

function RouteComponent() {
  const { projectId } = Route.useParams()
  const view = useProjectView(projectId, { backlog: true })
  const { project, stages, members, epics, sprints, currentUserId } = view
  const issues = view.backlogIssues
  const allIssues = view.issues
  const [search, setSearch] = useState("")
  const [selectedEpicId, setSelectedEpicId] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [createDefaults, setCreateDefaults] = useState<NewIssueDefaults | null>(null)
  const [openIssueId, setOpenIssueId] = useState<string | null>(null)

  const epicsById = useMemo(
    () => Object.fromEntries(epics.map((e) => [e.id, e])) as Record<string, Epic>,
    [epics]
  )

  const epicProgress = useMemo(() => {
    const result: Record<string, EpicProgress> = {}
    for (const i of allIssues) {
      if (!i.epicId) continue
      const p = result[i.epicId] ?? { done: 0, total: 0 }
      result[i.epicId] = p
      p.total++
      if (i.done) p.done++
    }
    return result
  }, [allIssues])

  const visibleIssues = useMemo(() => {
    const q = search.trim().toLowerCase()
    return issues.filter(
      (i) =>
        (!selectedEpicId || i.epicId === selectedEpicId) &&
        (!q || i.title.toLowerCase().includes(q) || i.key.toLowerCase().includes(q))
    )
  }, [issues, search, selectedEpicId])

  const activeSprint = sprints.find((s) => s.status === "active")
  const plannedSprints = sprints.filter((s) => s.status === "planned")
  const draggingIssue = issues.find((i) => i.id === draggingId)

  const moveIssue = (issueId: string, sprintId: string | null) => {
    view.moveToSprint(issueId, sprintId)
    setDraggingId(null)
  }

  const createSprint = () =>
    view.createSprint.mutate({
      name: `Спринт ${sprints.length + 1}`,
      goal: null,
      startDate: null,
      endDate: null,
    })

  const quickCreate = ({ type, title }: { type: TaskType; title: string }) =>
    view.createIssue({
      type,
      title,
      description: null,
      stageId: stages[0]?.id ?? "",
      priority: "medium",
      assigneeId: null,
      epicId: selectedEpicId,
      sprintId: null,
      storyPoints: null,
    })

  if (view.isLoading) return <PageState loading />
  if (!project) return <PageState error={view.error} />

  const { canEdit, canManageSprints } = view
  const createErrorText = (err: unknown) => createIssueErrorMessage(err)

  const dragProps = {
    draggingId,
    onDragStart: canEdit ? setDraggingId : undefined,
    onDragEnd: () => setDraggingId(null),
    onOpen: setOpenIssueId,
  }

  return (
    <div className="flex min-w-0 flex-col">
      <ProjectHeader
        projectName={project.name}
        pageLabel="Беклог"
        searchPlaceholder="Пошук задач"
        search={search}
        onSearchChange={setSearch}
        onCreate={() => setCreateDefaults({ epicId: selectedEpicId ?? undefined })}
        showCreate={canEdit}
      />

      <ErrorBanner error={view.error} />

      <CreateIssueModal
        open={createDefaults !== null}
        onOpenChange={(open) => !open && setCreateDefaults(null)}
        project={project}
        nextKey={nextIssueKey([...allIssues, ...issues], project.key)}
        stages={stages}
        members={members}
        currentUserId={currentUserId}
        epics={epics}
        sprints={sprints.filter((s) => s.status !== "closed")}
        defaults={createDefaults ?? undefined}
        onCreate={view.createIssue}
      />

      <IssueDetailModal
        issueId={openIssueId}
        onClose={() => setOpenIssueId(null)}
        view={view}
        project={project}
      />

      <div className="flex flex-wrap items-start gap-6 px-8 py-7">
        <EpicsPanel
          epics={epics}
          progress={epicProgress}
          selectedId={selectedEpicId}
          onSelect={setSelectedEpicId}
          onCreate={canEdit ? () => setCreateDefaults({ type: "epic" }) : undefined}
        />

        <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-5">
          <h1 className="m-0 font-display text-[28px] font-extrabold tracking-[-0.02em]">
            Беклог
          </h1>

          {activeSprint && (
            <ActiveSprintBanner
              sprint={activeSprint}
              projectId={projectId}
              issueCount={allIssues.filter((i) => i.sprintId === activeSprint.id).length}
              onComplete={
                canManageSprints ? () => view.completeSprint.mutate(activeSprint.id) : undefined
              }
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
              onStart={
                !canManageSprints || activeSprint
                  ? undefined
                  : () => view.startSprint.mutate(sprint.id)
              }
              startHint={
                canManageSprints
                  ? "Спершу завершіть активний спринт"
                  : "Запускати спринти можуть лише Owner та Admin"
              }
              {...dragProps}
            />
          ))}

          <BacklogSection
            issues={visibleIssues.filter((i) => i.sprintId === null)}
            epicsById={epicsById}
            canDrop={!!draggingIssue && draggingIssue.sprintId !== null}
            onDropIssue={(id) => moveIssue(id, null)}
            onCreateIssue={canEdit ? quickCreate : undefined}
            formatCreateError={createErrorText}
            onCreateSprint={canManageSprints ? createSprint : undefined}
            {...dragProps}
          />
        </div>
      </div>
    </div>
  )
}
