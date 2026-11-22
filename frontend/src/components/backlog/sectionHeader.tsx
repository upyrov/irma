import { cn } from "cn"
import { ChevronDown } from "lucide-react"
import type { ReactNode } from "react"

type Props = {
  title: string
  collapsed: boolean
  onToggle: () => void
  children?: ReactNode
}

/** Заголовок секції спринту / беклогу зі згортанням */
export const SectionHeader = ({ title, collapsed, onToggle, children }: Props) => {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-hover px-[18px] py-4">
      <button
        type="button"
        aria-expanded={!collapsed}
        aria-label={collapsed ? `Розгорнути: ${title}` : `Згорнути: ${title}`}
        onClick={onToggle}
        className="flex size-6 cursor-pointer items-center justify-center rounded-md text-text-2 hover:bg-hover"
      >
        <ChevronDown
          className={cn("size-4 transition-transform", collapsed && "-rotate-90")}
        />
      </button>
      <h2 className="m-0 text-base font-bold">{title}</h2>
      {children}
    </div>
  )
}
