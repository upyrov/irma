type Member = { id: number; initials: string; color: string }

type Project = {
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
    color: '#2F5BEA',
    members: [
      { id: 1, initials: 'АБ', color: '#2F5BEA' },
      { id: 2, initials: 'ОК', color: '#17603C' },
      { id: 3, initials: 'ІМ', color: '#9B1C1C' },
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
    color: '#17603C',
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
    color: '#9B1C1C',
    members: [{ id: 6, initials: 'ВР', color: '#0E7490' }],
  },
]

export const teams = [
    {
    id: 1,
    name: 'HaU',
    color: '#5234ff',
        members: [
      { id: 4, initials: 'ДС', color: '#7C3AED' },
      { id: 5, initials: 'НП', color: '#D97706' },
    ],
  },
      {
    id: 2,
    name: 'Vlad',
    color: '#aeffc8',
        members: [
      { id: 4, initials: 'ДС', color: '#7C3AED' },
      { id: 5, initials: 'НП', color: '#D97706' },
      { id: 6, initials: 'НП', color: '#D97706' },
    ],
  },
  {
    id: 3,
    name: 'Kai',
    color: '#9B1C1C',
    members: [{ id: 6, initials: 'ВР', color: '#0E7490' }],
  }
]