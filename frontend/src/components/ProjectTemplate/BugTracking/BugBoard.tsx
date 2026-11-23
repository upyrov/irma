import { useMemo, useState } from "react"
import { buildIssue, nextIssueKey } from "#/components/createIssue/buildIssue"
import { CreateIssueModal } from "#/components/createIssue/createIssueModal"
import type { NewIssueDefaults, NewIssueValues } from "#/components/createIssue/types"
import type { Issue } from "#/components/ProjectTemplate/Scrum/backlog/types"
import { ProjectHeader } from "#/components/projectHeader"
import {
  bugIssues,
  bugStages,
  currentUserId,
  type Project,
  projectMembers,
} from "#/tempData"
import { BugColumn } from "./bugColumn"
import { BUG_INTAKE_STAGE, byPriority, matchesPriority } from "./bugConfig"
import { ASSIGNEE_ALL, ASSIGNEE_NONE, type BugFilterState, BugFilters } from "./bugFilters"
import { BugStats } from "./bugStats"

const initialFilters: BugFilterState = { priority: "all", assignee: ASSIGNEE_ALL, onlyMine: false }

const BugIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M9 6a3 3 0 0 1 6 0M7 9h10v5a5 5 0 0 1-10 0zM12 11v8M4 12h3M17 12h3M5 18l2.5-1.5M19 18l-2.5-1.5M5 7l2.5 2M19 7l-2.5 2" />
  </svg>
)

type Props = { project: Project }

/** Дошка багів: тріаж New → Triage → In Progress → Fixed → Verified, сортування за пріоритетом */
export const BugBoard = ({ project }: Props) => {
  const [issues, setIssues] = useState<Issue[]>(bugIssues)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState(initialFilters)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [createDefaults, setCreateDefaults] = useState<NewIssueDefaults | null>(null)

  const visibleIssues = useMemo(() => {
    const q = search.trim().toLowerCase()
    return issues
      .filter((i) => {
        if (!matchesPriority(i.priority, filters.priority)) return false
        if (filters.onlyMine && i.assignee?.id !== currentUserId) return false
        if (filters.assignee === ASSIGNEE_NONE && i.assignee) return false
        if (
          filters.assignee !== ASSIGNEE_ALL &&
          filters.assignee !== ASSIGNEE_NONE &&
          i.assignee?.id !== filters.assignee
        )
          return false
        return !q || i.title.toLowerCase().includes(q) || i.key.toLowerCase().includes(q)
      })
      .sort(byPriority)
  }, [issues, search, filters])

  const draggingIssue = issues.find((i) => i.id === draggingId)

  const moveIssue = (issueId: string, stageId: string) => {
    const done = bugStages.find((s) => s.id === stageId)?.isDone ?? false
    setIssues((prev) => prev.map((i) => (i.id === issueId ? { ...i, stageId, done } : i)))
    setDraggingId(null)
  }

  const addIssue = (values: NewIssueValues) =>
    setIssues((prev) => [
      ...prev,
      buildIssue(values, {
        issues: prev,
        projectKey: project.key,
        members: projectMembers,
        stages: bugStages,
      }),
    ])

  // Новий баг — завжди тип Bug і колонка New
  const openCreate = () => setCreateDefaults({ type: "bug", stageId: BUG_INTAKE_STAGE })

  return (
    <div className="flex min-w-0 flex-col">
      <ProjectHeader
        projectName={project.name}
        pageLabel="Дошка багів"
        searchPlaceholder="Пошук за ключем або назвою"
        searchClassName="w-[260px]"
        search={search}
        onSearchChange={setSearch}
        onCreate={openCreate}
        createLabel="Повідомити про баг"
        createIcon={<BugIcon />}
        createVariant="danger"
      />

      <CreateIssueModal
        open={createDefaults !== null}
        onOpenChange={(open) => !open && setCreateDefaults(null)}
        project={project}
        nextKey={nextIssueKey(issues, project.key)}
        stages={bugStages}
        members={projectMembers}
        currentUserId={currentUserId}
        epics={[]}
        defaults={createDefaults ?? undefined}
        onCreate={addIssue}
      />

      <div className="flex min-w-0 flex-col gap-[18px] px-8 py-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="m-0 mb-1.5 font-display text-[28px] font-extrabold tracking-[-0.02em]">
              Дошка багів
            </h1>
            <p className="m-0 text-sm text-muted">
              Нові баги потрапляють у New, після тріажу — в роботу. Сортування за пріоритетом.
            </p>
          </div>
          <BugStats issues={issues} />
        </div>

        <BugFilters members={projectMembers} value={filters} onChange={setFilters} />

        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-min items-start gap-3.5">
            {bugStages.map((stage) => (
              <BugColumn
                key={stage.id}
                stage={stage}
                issues={visibleIssues.filter((i) => i.stageId === stage.id)}
                canDrop={!!draggingIssue && draggingIssue.stageId !== stage.id}
                onDropIssue={(id) => moveIssue(id, stage.id)}
                onCreate={stage.id === BUG_INTAKE_STAGE ? openCreate : undefined}
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
