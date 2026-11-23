import { Link } from "@tanstack/react-router"
import { cn } from "cn"
import { Plus, Search } from "lucide-react"
import type { ReactNode } from "react"
import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"

type Props = {
  projectName: string
  pageLabel: string
  searchPlaceholder?: string
  /** Без search / onSearchChange поле пошуку не показується */
  search?: string
  onSearchChange?: (value: string) => void
  /** Додаткові класи для поля пошуку (напр. ширина) */
  searchClassName?: string
  showCreate?: boolean
  onCreate?: () => void
  /** Текст, іконка та колір кнопки створення — за замовчуванням «+ Створити» */
  createLabel?: string
  createIcon?: ReactNode
  createVariant?: "default" | "danger"
}

export const ProjectHeader = ({
  projectName,
  pageLabel,
  searchPlaceholder = "Пошук задач",
  search,
  onSearchChange,
  searchClassName,
  showCreate = true,
  onCreate,
  createLabel = "Створити",
  createIcon = <Plus className="size-4" strokeWidth={2.2} />,
  createVariant = "default",
}: Props) => {
  return (
    <header className="box-border flex min-h-[68px] flex-wrap items-center gap-3 border-b border-border bg-white px-8 py-3.5">
      <nav
        aria-label="Навігація"
        className="min-w-[200px] flex-1 text-sm text-muted"
      >
        <Link to="/" className="text-muted no-underline hover:text-ink">
          Проєкти
        </Link>
        {" / "}
        {projectName}
        {" / "}
        <span className="font-semibold text-ink">{pageLabel}</span>
      </nav>

      {onSearchChange && (
        <div className="relative flex items-center">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 size-4 text-muted"
          />
          <Label htmlFor="project-search" className="sr-only">
            {searchPlaceholder}
          </Label>
          <Input
            id="project-search"
            type="search"
            placeholder={searchPlaceholder}
            value={search ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn("h-10 w-60 max-w-full bg-[#F8F9FB] pl-9 text-sm", searchClassName)}
          />
        </div>
      )}

      {showCreate && (
        <Button size="sm" variant={createVariant} onClick={onCreate}>
          {createIcon}
          {createLabel}
        </Button>
      )}
    </header>
  )
}
