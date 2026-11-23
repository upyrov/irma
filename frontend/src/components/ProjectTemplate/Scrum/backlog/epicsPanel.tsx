import { cn } from "cn"
import { Plus } from "lucide-react"
import { Button } from "#/components/ui/button"
import type { Epic, EpicColor } from "./types"

export const epicSolid: Record<EpicColor, string> = {
  purple: "bg-epic",
  blue: "bg-primary",
  orange: "bg-orange",
  green: "bg-success",
}

export type EpicProgress = { done: number; total: number }

type EpicItemProps = {
  epic: Epic
  progress: EpicProgress
  selected: boolean
  onSelect: () => void
}

const EpicItem = ({ epic, progress, selected, onSelect }: EpicItemProps) => {
  const pct = progress.total ? (progress.done / progress.total) * 100 : 0
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "flex cursor-pointer flex-col gap-2 rounded-[10px] border px-3 py-2.5 text-left",
        selected
          ? "border-primary bg-primary-soft"
          : "border-border bg-white hover:border-border-input"
      )}
    >
      <span className="flex items-center gap-2 text-sm font-semibold text-ink">
        <span className={cn("size-2.5 rounded-[3px]", epicSolid[epic.color])} />
        {epic.name}
      </span>
      <span className="block h-1.5 overflow-hidden rounded-[3px] bg-hover">
        <span
          className={cn("block h-1.5", epicSolid[epic.color])}
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className="text-xs text-muted">
        {epic.key} · {progress.done} / {progress.total} виконано
      </span>
    </button>
  )
}

type Props = {
  epics: Epic[]
  progress: Record<string, EpicProgress>
  selectedId: string | null
  onSelect: (id: string | null) => void
  onCreate?: () => void
}

export const EpicsPanel = ({
  epics,
  progress,
  selectedId,
  onSelect,
  onCreate,
}: Props) => {
  return (
    <section
      aria-label="Епіки"
      className="box-border flex max-w-full flex-[1_1_220px] flex-col gap-2.5 rounded-[14px] border border-border bg-white p-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="m-0 text-[15px] font-bold">Епіки</h2>
        {onCreate && (
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="Створити епік"
            onClick={onCreate}
            className="size-7 rounded-md border-none bg-hover px-0 text-text-2"
          >
            <Plus className="size-3.5" strokeWidth={2.2} />
          </Button>
        )}
      </div>

      <button
        type="button"
        aria-pressed={selectedId === null}
        onClick={() => onSelect(null)}
        className={cn(
          "cursor-pointer rounded-[10px] border px-3 py-2.5 text-left text-sm font-semibold",
          selectedId === null
            ? "border-primary bg-primary-soft text-primary-hover"
            : "border-border bg-white text-ink hover:border-border-input"
        )}
      >
        Усі задачі
      </button>

      {epics.map((epic) => (
        <EpicItem
          key={epic.id}
          epic={epic}
          progress={progress[epic.id] ?? { done: 0, total: 0 }}
          selected={selectedId === epic.id}
          onSelect={() => onSelect(selectedId === epic.id ? null : epic.id)}
        />
      ))}
    </section>
  )
}
