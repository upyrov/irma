import { cn } from "cn"
import type { Assignee } from "#/components/backlog/types"
import { Avatar } from "#/components/ui/avatar"

type Props = {
  members: Assignee[]
  selectedIds: string[]
  onToggle: (id: string) => void
}

export const AssigneeFilter = ({ members, selectedIds, onToggle }: Props) => {
  return (
    <fieldset className="m-0 flex border-none p-0 pr-1.5">
      <legend className="sr-only">Фільтр за виконавцем</legend>
      {members.map((m) => {
        const selected = selectedIds.includes(m.id)
        return (
          <button
            key={m.id}
            type="button"
            aria-label={m.name}
            aria-pressed={selected}
            title={m.name}
            onClick={() => onToggle(m.id)}
            className={cn(
              "-mr-1.5 cursor-pointer rounded-full border-2 last:mr-0 hover:z-10",
              selected ? "z-10 border-primary" : "border-white"
            )}
          >
            <Avatar initials={m.initials} color={m.color} className="size-[30px] text-[11px]" />
          </button>
        )
      })}
    </fieldset>
  )
}
