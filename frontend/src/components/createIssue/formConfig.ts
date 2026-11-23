import type { TaskType } from "#/components/ui/task-type"
import type { Project } from "#/tempData"

export type IssueFormConfig = {
  title: string
  submitLabel: string
  /** Дозволені типи; якщо тип один — вибір типу не показується */
  types: TaskType[]
  defaultType: TaskType
  /** Які необовʼязкові поля показувати */
  fields: { epic: boolean; sprint: boolean; storyPoints: boolean }
  titlePlaceholder: string
  descriptionPlaceholder: string
}

/** Як виглядає форма «Нова задача» в кожному шаблоні проєкту */
export const issueFormConfig: Record<Project["template"], IssueFormConfig> = {
  Scrum: {
    title: "Нова задача",
    submitLabel: "Створити задачу",
    types: ["story", "task", "epic"],
    defaultType: "story",
    fields: { epic: true, sprint: true, storyPoints: true },
    titlePlaceholder: "Коротко: що потрібно зробити",
    descriptionPlaceholder: "Контекст і критерії готовності",
  },
  Kanban: {
    title: "Нова задача",
    submitLabel: "Створити задачу",
    types: ["story", "task", "epic"],
    defaultType: "task",
    // Kanban — безперервний потік: без спринтів і без оцінок
    fields: { epic: true, sprint: false, storyPoints: false },
    titlePlaceholder: "Коротко: що потрібно зробити",
    descriptionPlaceholder: "Контекст і критерії готовності",
  },
  "Bug tracking": {
    title: "Новий баг",
    submitLabel: "Повідомити про баг",
    types: ["bug"],
    defaultType: "bug",
    fields: { epic: false, sprint: false, storyPoints: false },
    titlePlaceholder: "Що зламалося? Напр.: «Після логіну редірект на 404»",
    descriptionPlaceholder: "Кроки відтворення, очікуваний і фактичний результат, браузер / пристрій",
  },
}
