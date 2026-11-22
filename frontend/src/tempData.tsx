import type { Assignee, Epic, Issue, Sprint, Stage } from '#/components/ProjectTemplate/Scrum/backlog/types'
import type { ProjectMember } from '#/components/ProjectTemplate/Scrum/settings/types'

type Member = { id: number; initials: string; color: string }

export type Project = {
  id: number
  key: string
  name: string
  team: string
  template: 'Scrum' | 'Kanban' | 'Bug tracking'
  description: string
  stat: string
  color: string
  members: Member[]
}

export const projects: Project[] = [
  {
    id: 1,
    key: 'KAI',
    name: 'Платформа KAI',
    team: 'Команда КАІ',
    template: 'Scrum',
    description: 'Основний вебзастосунок для керування задачами та спринтами.',
    stat: '24 задачі',
    color: 'var(--color-primary)',
    members: [
      { id: 1, initials: 'АБ', color: 'var(--color-primary)' },
      { id: 2, initials: 'ОК', color: 'var(--color-success-text)' },
      { id: 3, initials: 'ІМ', color: 'var(--color-danger-text)' },
    ],
  },
  {
    id: 2,
    key: 'MOB',
    name: 'Мобільний клієнт',
    team: 'Mobile Crew',
    template: 'Kanban',
    description: 'iOS та Android застосунок із синхронізацією в реальному часі.',
    stat: '12 задач',
    color: 'var(--color-success-text)',
    members: [
      { id: 4, initials: 'ДС', color: '#7C3AED' },
      { id: 5, initials: 'НП', color: '#D97706' },
    ],
  },
  {
    id: 3,
    key: 'QA',
    name: 'Тестування релізів',
    team: 'QA Guild',
    template: 'Bug tracking',
    description: 'Облік дефектів і регресійних перевірок перед релізом.',
    stat: '8 багів',
    color: 'var(--color-danger-text)',
    members: [{ id: 6, initials: 'ВР', color: '#0E7490' }],
  },
]

type TeamMember = {
  id: number
  name: string
  usertag: string
  initials: string
  color: string
}

type Team = {
  id: number
  name: string
  color: string
  members: TeamMember[]
}

export const teams: Team[] = [
  {
    id: 1,
    name: 'HaU',
    color: '#5234FF',
    members: [
      { id: 4, name: 'Саша Дорошенко', usertag: 'saddd', initials: 'СД', color: '#7C3AED' },
      { id: 5, name: 'Назар Петренко', usertag: 'nazar.p', initials: 'НП', color: '#D97706' },
    ],
  },
  {
    id: 2,
    name: 'Vlad',
    color: 'var(--color-success)',
    members: [
      { id: 4, name: 'Саша Дорошенко', usertag: 'saddd', initials: 'СД', color: '#7C3AED' },
      { id: 5, name: 'Назар Петренко', usertag: 'nazar.p', initials: 'НП', color: '#D97706' },
      { id: 7, name: 'Наталія Павленко', usertag: 'natali', initials: 'НП', color: '#A8326B' },
    ],
  },
  {
    id: 3,
    name: 'Kai',
    color: 'var(--color-danger-text)',
    members: [
      { id: 6, name: 'Віктор Руденко', usertag: 'vrud', initials: 'ВР', color: '#0E7490' },
    ],
  },
]

// ---- Беклог ----

const ab: Assignee = { id: 'u1', name: 'Артем Б.', initials: 'АБ', color: 'var(--color-primary)' }
const ok: Assignee = { id: 'u2', name: 'Олена К.', initials: 'ОК', color: '#B4441C' }
const mt: Assignee = { id: 'u3', name: 'Максим Т.', initials: 'МТ', color: 'var(--color-success)' }
const im: Assignee = { id: 'u4', name: 'Ірина М.', initials: 'ІМ', color: 'var(--color-epic)' }

/** Поточний користувач — для фільтра «Тільки мої» */
export const currentUserId = ab.id

export const projectMembers: Assignee[] = [ab, ok, mt, im]

export const scrumStages: Stage[] = [
  { id: 'todo', name: 'To Do', isDone: false },
  { id: 'progress', name: 'In Progress', isDone: false },
  { id: 'done', name: 'Done', isDone: true },
]

export const kanbanStages: Stage[] = [
  { id: 'backlog', name: 'Backlog', isDone: false },
  { id: 'selected', name: 'Selected', isDone: false },
  { id: 'progress', name: 'In Progress', isDone: false },
  { id: 'done', name: 'Done', isDone: true },
]

export const backlogEpics: Epic[] = [
  { id: 'e1', key: 'KAI-1', name: 'Автентифікація', color: 'purple' },
  { id: 'e2', key: 'KAI-2', name: 'Scrum-планування', color: 'blue' },
  { id: 'e3', key: 'KAI-3', name: 'Канбан-дошка', color: 'orange' },
]

export const backlogSprints: Sprint[] = [
  {
    id: 's2',
    name: 'Спринт 2',
    goal: 'авторизація через HttpOnly cookie та дашборд проєктів',
    startDate: '2026-11-10',
    endDate: '2026-11-24',
    status: 'active',
  },
  {
    id: 's3',
    name: 'Спринт 3',
    goal: 'користувач може спланувати спринт і перетягувати задачі між беклогом і спринтом.',
    startDate: '2026-11-24',
    endDate: '2026-12-08',
    status: 'planned',
  },
]

export const backlogIssues: Issue[] = [
  // Спринт 2 (активний)
  { id: 'i4', key: 'KAI-4', title: 'Форма входу та реєстрації', type: 'story', priority: 'high', storyPoints: 5, assignee: ab, epicId: 'e1', stageId: 'done', sprintId: 's2', done: true },
  { id: 'i5', key: 'KAI-5', title: 'JWT refresh-токени', type: 'task', priority: 'highest', storyPoints: 3, assignee: ok, epicId: 'e1', stageId: 'done', sprintId: 's2', done: true },
  { id: 'i6', key: 'KAI-6', title: 'Колонки дошки за шаблоном', type: 'story', priority: 'medium', storyPoints: 5, assignee: im, epicId: 'e3', stageId: 'progress', sprintId: 's2', done: false },
  { id: 'i8', key: 'KAI-8', title: 'Дашборд проєктів', type: 'story', priority: 'medium', storyPoints: 3, assignee: mt, epicId: 'e2', stageId: 'progress', sprintId: 's2', done: false },
  { id: 'i9', key: 'KAI-9', title: 'Logout очищає HttpOnly cookie', type: 'task', priority: 'high', storyPoints: 1, assignee: ok, epicId: 'e1', stageId: 'todo', sprintId: 's2', done: false },
  { id: 'i10', key: 'KAI-10', title: 'Порожній стан дошки', type: 'task', priority: 'low', storyPoints: 2, assignee: mt, epicId: 'e3', stageId: 'todo', sprintId: 's2', done: false },
  { id: 'i7', key: 'KAI-7', title: 'Не зберігається порядок колонок', type: 'bug', priority: 'high', storyPoints: 2, assignee: ab, epicId: 'e3', stageId: 'todo', sprintId: 's2', done: false },

  // Спринт 3 (запланований)
  { id: 'i12', key: 'KAI-12', title: 'Створення та редагування спринту', type: 'story', priority: 'high', storyPoints: 5, assignee: ab, epicId: 'e2', stageId: 'todo', sprintId: 's3', done: false },
  { id: 'i13', key: 'KAI-13', title: 'Drag & drop задач між беклогом і спринтом', type: 'story', priority: 'highest', storyPoints: 8, assignee: ok, epicId: 'e2', stageId: 'todo', sprintId: 's3', done: false },
  { id: 'i14', key: 'KAI-14', title: 'Підрахунок story points спринту', type: 'task', priority: 'medium', storyPoints: 2, assignee: im, epicId: 'e2', stageId: 'todo', sprintId: 's3', done: false },
  { id: 'i15', key: 'KAI-15', title: 'Скидання пароля поштою', type: 'task', priority: 'low', storyPoints: 1, assignee: null, epicId: 'e1', stageId: 'todo', sprintId: 's3', done: false },

  // Беклог
  { id: 'i21', key: 'KAI-21', title: 'Фільтр задач за виконавцем на дошці', type: 'story', priority: 'medium', storyPoints: 3, assignee: ok, epicId: 'e3', stageId: 'todo', sprintId: null, done: false },
  { id: 'i22', key: 'KAI-22', title: 'WIP-ліміти для колонок', type: 'story', priority: 'low', storyPoints: 5, assignee: null, epicId: 'e3', stageId: 'todo', sprintId: null, done: false },
  { id: 'i23', key: 'KAI-23', title: 'Помилка при порожній цілі спринту', type: 'bug', priority: 'high', storyPoints: 1, assignee: im, epicId: 'e2', stageId: 'todo', sprintId: null, done: false },
  { id: 'i24', key: 'KAI-24', title: 'Вхід через Google', type: 'task', priority: 'lowest', storyPoints: 3, assignee: null, epicId: 'e1', stageId: 'todo', sprintId: null, done: false },
  { id: 'i25', key: 'KAI-25', title: 'Burndown-графік спринту', type: 'story', priority: 'medium', storyPoints: 8, assignee: ab, epicId: 'e2', stageId: 'todo', sprintId: null, done: false },
  { id: 'i26', key: 'KAI-26', title: 'Оновити залежності фронтенду', type: 'task', priority: 'lowest', storyPoints: null, assignee: null, epicId: null, stageId: 'todo', sprintId: null, done: false },
]

// ---- Налаштування: учасники проєкту ----

export const settingsMembers: ProjectMember[] = [
  { ...ab, username: 'artem.b', role: 'owner' },
  { ...ok, username: 'olena.k', role: 'admin' },
  { ...mt, username: 'maksym.t', role: 'member' },
  { ...im, username: 'iryna.m', role: 'member' },
  { id: 'u5', name: 'Дмитро С.', initials: 'ДС', color: '#0E7490', username: 'dmytro.s', role: 'viewer' },
]
