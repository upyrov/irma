import { cn } from "cn"

type Props = {
  label?: string
  className?: string
}

export const Spinner = ({ label = "Завантаження", className }: Props) => (
  <output className={cn("inline-flex shrink-0 text-primary", className)}>
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="size-full animate-spin motion-reduce:animate-[spin_1.5s_linear_infinite]"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-20" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
    <span className="sr-only">{label}</span>
  </output>
)

export const PageSpinner = ({ label, className }: Props) => (
  <div className={cn("flex min-h-[240px] flex-1 items-center justify-center", className)}>
    <Spinner label={label} className="size-8" />
  </div>
)
