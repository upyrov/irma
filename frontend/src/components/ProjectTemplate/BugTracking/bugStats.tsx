import { cn } from "cn"
import type { Issue, Stage } from "#/components/ProjectTemplate/Scrum/backlog/types"
import { FIXED_STAGE_KEYS } from "./bugConfig"

type Props = { issues: Issue[]; stages: Stage[] }

/** Лічильники над дошкою — рахуються з усіх багів, без урахування фільтрів */
export const BugStats = ({ issues, stages }: Props) => {
  const fixedIds = new Set(
    stages.filter((s) => FIXED_STAGE_KEYS.includes(s.key) || s.isDone).map((s) => s.id)
  )
  const open = issues.filter((i) => !fixedIds.has(i.stageId))
  const stats = [
    { label: "Відкритих", value: open.length, className: "text-ink" },
    {
      label: "Highest",
      value: open.filter((i) => i.priority === "highest").length,
      className: "text-danger",
    },
    { label: "Без виконавця", value: open.filter((i) => !i.assignee).length, className: "text-orange" },
    { label: "Виправлено", value: issues.length - open.length, className: "text-success" },
  ]

  return (
    <div className="flex flex-wrap gap-2.5">
      {stats.map((s) => (
        <div key={s.label} className="min-w-28 rounded-xl border border-border bg-white px-3.5 py-2.5">
          <div className={cn("font-display text-[22px] font-extrabold", s.className)}>{s.value}</div>
          <div className="text-xs text-muted">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
