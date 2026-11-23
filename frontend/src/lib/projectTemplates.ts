import type { QueryClient } from "@tanstack/react-query"
import { notFound, redirect } from "@tanstack/react-router"
import { toUiTemplate, type UiTemplate } from "#/api/adapters"
import { projectsQueryOptions } from "#/api/hooks/useProjects"

type Template = UiTemplate

/** Розділ проєкту — збігається з останнім сегментом URL */
export type ProjectSection = "backlog" | "board" | "settings"

/** Які розділи доступні для кожного шаблону проєкту (порядок = порядок у меню) */
const templateFeatures: Record<Template, Record<ProjectSection, boolean>> = {
  Scrum: { backlog: true, board: true, settings: true },
  Kanban: { backlog: false, board: true, settings: true },
  // Bug Tracking: лише дошка багів (налаштування ще в розробці)
  "Bug tracking": { backlog: false, board: true, settings: false },
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

/**
 * `beforeLoad` для маршрутів проєкту: не пускає в розділ, якого немає в шаблоні.
 * Веде в перший доступний розділ, а якщо таких немає — на список проєктів.
 */
export const guardSection =
  (section: ProjectSection) =>
  async ({
    params,
    context,
  }: {
    params: { projectId: string }
    context: { queryClient: QueryClient }
  }) => {
    const projects = await context.queryClient.ensureQueryData(projectsQueryOptions)
    const project = projects.find((p) => p.id === params.projectId)
    if (!project) throw notFound()
    const template = toUiTemplate(project.template)
    if (hasSection(template, section)) return

    const fallback = firstSection(template)
    if (fallback) {
      throw redirect({ to: sectionPath[fallback], params, replace: true })
    }
    throw redirect({ to: "/", replace: true })
  }
