import { Link, useParams } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { projects } from "#/tempData"

export const navItemClass =
  "flex h-10 items-center gap-2.5 rounded-lg px-2.5 text-sm no-underline"
export const navItemActive = { className: "bg-primary-tint font-semibold text-primary-hover" }
export const navItemInactive = {
  className: "font-medium text-text-2 hover:bg-hover hover:text-ink",
}

type Section = {
  to:
    | "/projects/$projectId/backlog"
    | "/projects/$projectId/board"
    | "/projects/$projectId/settings"
  label: string
  icon: ReactNode
}

const icon = (children: ReactNode) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    {children}
  </svg>
)

export const Navigation = () => {
  const { projectId = String(projects[0].id) } = useParams({ strict: false })
  const project = projects.find((p) => String(p.id) === projectId)
  const isKanban = project?.template === "Kanban"

  const sections: Section[] = [
    ...(isKanban
      ? []
      : [
          {
            to: "/projects/$projectId/backlog" as const,
            label: "Беклог",
            icon: icon(<path d="M4 6h16M4 12h16M4 18h10" />),
          },
        ]),
    {
      to: "/projects/$projectId/board",
      label: isKanban ? "Дошка" : "Активна дошка",
      icon: icon(
        <>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M9 4v16M15 4v16" />
        </>
      ),
    },
    {
      to: "/projects/$projectId/settings",
      label: "Налаштування",
      icon: icon(
        <>
          <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
          <circle cx="16" cy="7" r="2" />
          <circle cx="10" cy="17" r="2" />
        </>
      ),
    },
  ]

  return (
    <nav className="flex flex-col gap-0.5">
      <span className="px-2.5 pb-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-muted">
        Планування
      </span>
      {sections.map((s) => (
        <Link
          key={s.to}
          to={s.to}
          params={{ projectId }}
          className={navItemClass}
          activeProps={navItemActive}
          inactiveProps={navItemInactive}
        >
          {s.icon}
          {s.label}
        </Link>
      ))}
    </nav>
  )
}
