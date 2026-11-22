import { notFound, redirect } from "@tanstack/react-router"
import { type Project, projects } from "#/tempData"

type Template = Project["template"]

/** Розділ проєкту — збігається з останнім сегментом URL */
export type ProjectSection = "backlog" | "board" | "settings"

/** Які розділи доступні для кожного шаблону проєкту (порядок = порядок у меню) */
const templateFeatures: Record<Template, Record<ProjectSection, boolean>> = {
  Scrum: { backlog: true, board: true, settings: true },
  Kanban: { backlog: false, board: true, settings: true },
  // Bug Tracking ще в розробці — усі розділи закриті
  "Bug tracking": { backlog: false, board: false, settings: false },
}

const sectionOrder: ProjectSection[] = ["backlog", "board", "settings"]

export const sectionPath = {
  backlog: "/projects/$projectId/backlog",
  board: "/projects/$projectId/board",
  settings: "/projects/$projectId/settings",
} as const satisfies Record<ProjectSection, string>

export const hasSection = (template: Template, section: ProjectSection) =>
  templateFeatures[template][section]

export const hasBacklog = (template: Template) => hasSection(template, "backlog")

/** Перший доступний розділ шаблону; null — проєкт повністю закритий */
export const firstSection = (template: Template): ProjectSection | null =>
  sectionOrder.find((s) => hasSection(template, s)) ?? null

/** Чи можна взагалі відкрити проєкт */
export const isProjectAvailable = (template: Template) => firstSection(template) !== null

/** Проєкт за параметром маршруту (у моках id — число, у URL — рядок) */
export const findProject = (projectId: string | undefined) =>
  projects.find((p) => String(p.id) === projectId)

/**
 * `beforeLoad` для маршрутів проєкту: не пускає в розділ, якого немає в шаблоні.
 * Веде в перший доступний розділ, а якщо таких немає — на список проєктів.
 */
export const guardSection =
  (section: ProjectSection) =>
  ({ params }: { params: { projectId: string } }) => {
    const project = findProject(params.projectId)
    if (!project) throw notFound()
    if (hasSection(project.template, section)) return

    const fallback = firstSection(project.template)
    if (fallback) {
      throw redirect({ to: sectionPath[fallback], params, replace: true })
    }
    throw redirect({ to: "/", replace: true })
  }
