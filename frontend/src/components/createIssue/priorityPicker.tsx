import { type Priority, PriorityIcon, priorities } from "#/components/ui/priority"

const order = Object.keys(priorities) as Priority[]

type Props = {
  value: Priority
  onChange: (priority: Priority) => void
}

/** Пріоритет кнопками: усі 5 варіантів видно одразу, з кольоровими іконками */
export const PriorityPicker = ({ value, onChange }: Props) => {
  return (
    <fieldset className="m-0 border-none p-0">
      <legend className="mb-2 p-0 text-sm font-semibold">Пріоритет</legend>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(104px,1fr))] gap-1.5">
        {order.map((p) => (
          <label
            key={p}
            className="flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border border-border-input bg-white px-2 text-[13px] font-semibold text-text-2 hover:border-subtle has-[:checked]:border-primary has-[:checked]:bg-primary-soft has-[:checked]:text-ink has-[:checked]:ring-1 has-[:checked]:ring-primary has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-primary/35"
          >
            <input
              type="radio"
              name="issue-priority"
              value={p}
              checked={value === p}
              onChange={() => onChange(p)}
              className="sr-only"
            />
            <PriorityIcon priority={p} className="size-4" />
            {priorities[p].label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
