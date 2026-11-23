import { useState } from "react"
import { Button } from "#/components/ui/button"
import type { TaskType } from "#/components/ui/task-type"
import { issuesCount } from "./format"
import { DropZone, type IssueDragProps, IssueList } from "./issueList"
import { QuickCreateForm } from "./quickCreateForm"
import { SectionHeader } from "./sectionHeader"
import type { Epic, Issue } from "./types"
import { useDropTarget } from "./useDropTarget"

type Props = IssueDragProps & {
  issues: Issue[]
  epicsById: Record<string, Epic>
  canDrop: boolean
  onDropIssue: (issueId: string) => void
  onCreateIssue?: (data: { type: TaskType; title: string }) => Promise<unknown>
  formatCreateError: (error: unknown) => string
  onCreateSprint?: () => void
}

export const BacklogSection = ({
  issues,
  epicsById,
  canDrop,
  onDropIssue,
  onCreateIssue,
  formatCreateError,
  onCreateSprint,
  ...drag
}: Props) => {
  const [collapsed, setCollapsed] = useState(false)
  const { isOver, handlers } = useDropTarget(canDrop, onDropIssue)

  return (
    <section
      aria-label="Беклог"
      className="overflow-hidden rounded-[14px] border border-border bg-white"
      {...handlers}
    >
      <SectionHeader
        title="Беклог"
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      >
        <span className="text-[13px] text-muted">
          {issuesCount(issues.length)} без спринту
        </span>
        <span className="flex-1" />
        {onCreateSprint && (
          <Button
            variant="secondary"
            size="xs"
            onClick={onCreateSprint}
            className="px-3.5"
          >
            Створити спринт
          </Button>
        )}
      </SectionHeader>

      {!collapsed && (
        <IssueList
          issues={issues}
          epicsById={epicsById}
          emptyText="Беклог порожній."
          {...drag}
        />
      )}

      <DropZone
        visible={canDrop}
        active={isOver}
        label="Відпустіть, щоб повернути в беклог"
      />

      {onCreateIssue && <QuickCreateForm onCreate={onCreateIssue} formatError={formatCreateError} />}
    </section>
  )
}
