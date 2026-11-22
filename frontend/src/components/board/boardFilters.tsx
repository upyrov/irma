import { cn } from "cn"
import type { Assignee, Epic } from "#/components/backlog/types"
import { Button } from "#/components/ui/button"
import { Label } from "#/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import { type TaskType, TaskTypeLabel } from "#/components/ui/task-type"
import { AssigneeFilter } from "./assigneeFilter"

export const ALL = "all"

export type BoardFilterState = {
  assigneeIds: string[]
  epicId: string
  type: TaskType | typeof ALL
  onlyMine: boolean
}

const typeOptions: TaskType[] = ["story", "task", "bug"]
const triggerClass = "h-9 min-w-36 rounded-lg text-sm"

type Props = {
  members: Assignee[]
  epics: Epic[]
  value: BoardFilterState
  onChange: (value: BoardFilterState) => void
}

export const BoardFilters = ({ members, epics, value, onChange }: Props) => {
  const set = (patch: Partial<BoardFilterState>) => onChange({ ...value, ...patch })

  const toggleAssignee = (id: string) =>
    set({
      assigneeIds: value.assigneeIds.includes(id)
        ? value.assigneeIds.filter((a) => a !== id)
        : [...value.assigneeIds, id],
    })

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <AssigneeFilter
        members={members}
        selectedIds={value.assigneeIds}
        onToggle={toggleAssignee}
      />

      <Label htmlFor="f-epic" className="sr-only">
        Епік
      </Label>
      <Select value={value.epicId} onValueChange={(epicId) => set({ epicId })}>
        <SelectTrigger id="f-epic" className={triggerClass}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Епік: усі</SelectItem>
          {epics.map((e) => (
            <SelectItem key={e.id} value={e.id}>
              {e.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label htmlFor="f-type" className="sr-only">
        Тип
      </Label>
      <Select
        value={value.type}
        onValueChange={(type) => set({ type: type as BoardFilterState["type"] })}
      >
        <SelectTrigger id="f-type" className={triggerClass}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>Тип: усі</SelectItem>
          {typeOptions.map((t) => (
            <SelectItem key={t} value={t}>
              <TaskTypeLabel type={t} className="text-sm text-ink" />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="xs"
        aria-pressed={value.onlyMine}
        onClick={() => set({ onlyMine: !value.onlyMine })}
        className={cn("px-3", value.onlyMine && "bg-primary-tint text-primary-hover")}
      >
        Тільки мої
      </Button>
    </div>
  )
}
