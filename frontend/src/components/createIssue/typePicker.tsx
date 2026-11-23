import { type TaskType, TaskTypeIcon, taskTypes } from "#/components/ui/task-type"

type Props = {
  types: TaskType[]
  value: TaskType
  onChange: (type: TaskType) => void
}

export const TypePicker = ({ types, value, onChange }: Props) => {
  return (
    <fieldset className="m-0 border-none p-0">
      <legend className="mb-2 p-0 text-sm font-semibold">Тип</legend>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${types.length}, minmax(0, 1fr))` }}
      >
        {types.map((t) => (
          <label
            key={t}
            className="flex h-12 cursor-pointer items-center gap-2.5 rounded-[10px] border border-border-input bg-white px-3 hover:border-subtle has-[:checked]:border-primary has-[:checked]:bg-primary-soft has-[:checked]:ring-1 has-[:checked]:ring-primary has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-primary/35"
          >
            <input
              type="radio"
              name="issue-type"
              value={t}
              checked={value === t}
              onChange={() => onChange(t)}
              className="sr-only"
            />
            <TaskTypeIcon type={t} className="size-5" />
            <span className="truncate text-sm font-semibold">{taskTypes[t].label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
