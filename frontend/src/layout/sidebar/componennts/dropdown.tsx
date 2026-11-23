import { Link, useParams, useRouterState } from "@tanstack/react-router"
import { Check, ChevronDown } from "lucide-react"
import { DropdownMenu } from "radix-ui"
import { Badge } from "#/components/ui/badge"
import {
  findProject,
  firstSection,
  hasSection,
  type ProjectSection,
  sectionPath,
} from "#/lib/projectTemplates"
import { type Project, projects } from "#/tempData"

/** Розділ, у якому зараз користувач, — щоб після перемикання проєкту лишитися в ньому */
const useCurrentSection = (): ProjectSection => {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const section = pathname.split("/")[3]
  return section === "board" || section === "settings" ? section : "backlog"
}

const itemClass =
  "flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 text-ink no-underline outline-none data-[highlighted]:bg-hover data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60"

export function ProjectSwitcher() {
  const { projectId } = useParams({ strict: false })
  const section = useCurrentSection()
  const current = findProject(projectId) ?? projects[0]

  /** Той самий розділ, якщо він є в шаблоні, інакше перший доступний; null — проєкт закритий */
  const targetFor = (template: Project["template"]): ProjectSection | null => {
    if (template === "Scrum") return "backlog" 

    return hasSection(template, section) ? section : firstSection(template)
  }
    

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-border p-2.5 text-left outline-none hover:bg-[#F8F9FB] focus-visible:ring-[3px] focus-visible:ring-primary/30 data-[state=open]:border-primary"
        >
          <span
            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] font-display font-extrabold text-white"
            style={{ background: current.color }}
          >
            {current.key[0]}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold text-ink">{current.name}</div>
            <div className="text-xs text-muted">
              {current.template} · {current.key}
            </div>
          </div>
          <ChevronDown size={16} className="shrink-0 text-muted transition-transform [[data-state=open]>&]:rotate-180" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-50 w-[var(--radix-dropdown-menu-trigger-width)] rounded-xl border border-border bg-white p-1 shadow-[0_12px_32px_rgba(22,24,29,0.12)]"
        >
          {projects.map((p) => {
            const target = targetFor(p.template)
            const content = (
              <>
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] text-xs font-extrabold text-white"
                  style={{ background: p.color }}
                >
                  {p.key[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-ink">{p.name}</div>
                  <div className="text-xs text-muted">
                    {p.template} · {p.key}
                  </div>
                </div>
                {p.id === current.id && <Check size={16} className="shrink-0 text-primary" />}
                {!target && (
                  <Badge variant="yellow" size="chip" className="font-bold">
                    НЕЗАБАРОМ
                  </Badge>
                )}
              </>
            )

            // Проєкт без жодного доступного розділу не відкривається
            if (!target) {
              return (
                <DropdownMenu.Item key={p.id} disabled className={itemClass}>
                  {content}
                </DropdownMenu.Item>
              )
            }

            return (
              <DropdownMenu.Item key={p.id} asChild>
                <Link
                  to={sectionPath[target]}
                  params={{ projectId: String(p.id) }}
                  className={itemClass}
                >
                  {content}
                </Link>
              </DropdownMenu.Item>
            )
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
