import { cn } from "cn"

const points = [1, 2, 3, 5, 8]

type Props = {
  value: number | null
  onChange: (value: number | null) => void
}

export const StoryPointsPicker = ({ value, onChange }: Props) => {
  return (
    <fieldset className="m-0 flex flex-col gap-1.5 border-none p-0">
      <legend className="mb-1.5 p-0 text-sm font-semibold">Story Points</legend>
      <div className="flex gap-1.5">
        {points.map((p) => {
          const selected = value === p
          return (
            <button
              key={p}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(selected ? null : p)}
              className={cn(
                "h-11 flex-1 cursor-pointer rounded-[10px] border text-sm font-bold outline-none focus-visible:ring-[3px] focus-visible:ring-primary/35",
                selected
                  ? "border-primary bg-primary-soft text-primary-hover ring-1 ring-primary"
                  : "border-border-input bg-white text-text-2 hover:border-subtle"
              )}
            >
              {p}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
