import { type Project, projects } from "#/tempData"

type Template = Project["template"]

/** Які розділи доступні для кожного шаблону проєкту */
const templateFeatures: Record<Template, { backlog: boolean }> = {
  Scrum: { backlog: true },
  Kanban: { backlog: false },
  "Bug tracking": { backlog: false },
}

export const hasBacklog = (template: Template) => templateFeatures[template].backlog

/** Проєкт за параметром маршруту (у моках id — число, у URL — рядок) */
export const findProject = (projectId: string | undefined) =>
  projects.find((p) => String(p.id) === projectId)
