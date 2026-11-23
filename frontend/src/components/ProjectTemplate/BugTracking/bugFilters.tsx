import { cn } from "cn"
import type { Assignee } from "#/components/ProjectTemplate/Scrum/backlog/types"
import { Button } from "#/components/ui/button"
import { Label } from "#/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import { type PriorityFilter, priorityFilters } from "./bugConfig"

export const ASSIGNEE_ALL = "all"
export const ASSIGNEE_NONE = "none"

export type BugFilterState = {
  priority: PriorityFilter
  assignee: string
  onlyMine: boolean
}

type Props = {
  members: Assignee[]
  value: BugFilterState
  onChange: (value: BugFilterState) => void
}

export const BugFilters = ({ members, value, onChange }: Props) => {
  const set = (patch: Partial<BugFilterState>) => onChange({ ...value, ...patch })

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <fieldset className="m-0 flex flex-wrap gap-1.5 border-none p-0">
        <legend className="sr-only">Фільтр за пріоритетом</legend>
        {priorityFilters.map((f) => {
          const selected = value.priority === f.value
          return (
            <button
              key={f.value}
              type="button"
              aria-pressed={selected}
              onClick={() => set({ priority: f.value })}
              className={cn(
                "h-[34px] cursor-pointer rounded-full border px-3 text-[13px] font-semibold",
                selected
                  ? "border-ink bg-ink text-white"
                  : cn("border-border-input bg-white hover:border-subtle", f.className)
              )}
            >
              {f.label}
            </button>
          )
        })}
      </fieldset>

      <span aria-hidden="true" className="h-6 w-px bg-border-input" />

      <Label htmlFor="bug-assignee" className="sr-only">
        Виконавець
      </Label>
      <Select value={value.assignee} onValueChange={(assignee) => set({ assignee })}>
        <SelectTrigger id="bug-assignee" className="h-[34px] min-w-44 rounded-lg text-[13px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ASSIGNEE_ALL}>Виконавець: усі</SelectItem>
          <SelectItem value={ASSIGNEE_NONE}>Не призначено</SelectItem>
          {members.map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {m.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="xs"
        aria-pressed={value.onlyMine}
        onClick={() => set({ onlyMine: !value.onlyMine })}
        className={cn("px-3 text-[13px]", value.onlyMine && "bg-primary-tint text-primary-hover")}
      >
        Тільки мої
      </Button>
    </div>
  )
}
