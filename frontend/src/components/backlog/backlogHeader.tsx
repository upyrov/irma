import { Link } from "@tanstack/react-router"
import { Plus, Search } from "lucide-react"
import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"

type Props = {
  projectName: string
  search: string
  onSearchChange: (value: string) => void
  onCreate?: () => void
}

export const BacklogHeader = ({
  projectName,
  search,
  onSearchChange,
  onCreate,
}: Props) => {
  return (
    <header className="flex flex-wrap items-center gap-3 border-b border-border bg-white px-8 py-3.5">
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
        <span className="font-semibold text-ink">Беклог</span>
      </nav>

      <div className="relative flex items-center">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 size-4 text-muted"
        />
        <Label htmlFor="bl-search" className="sr-only">
          Пошук задач
        </Label>
        <Input
          id="bl-search"
          type="search"
          placeholder="Пошук задач"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 w-60 max-w-full bg-[#F8F9FB] pl-9 text-sm"
        />
      </div>

      <Button size="sm" onClick={onCreate}>
        <Plus className="size-4" strokeWidth={2.2} />
        Створити
      </Button>
    </header>
  )
}
