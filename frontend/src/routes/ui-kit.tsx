import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import type * as React from 'react'
import {
  Badge,
  IssueKey,
  RoleBadge,
  SprintStatusBadge,
  TemplateBadge,
} from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  type Priority,
  PriorityBadge,
  PriorityIcon,
  PriorityLabel,
} from '#/components/ui/priority'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Slider } from '#/components/ui/slider'
import { Switch } from '#/components/ui/switch'
import {
  type TaskType,
  TaskTypeIcon,
  TaskTypeLabel,
} from '#/components/ui/task-type'
import { Textarea } from '#/components/ui/textarea'

export const Route = createFileRoute('/ui-kit')({
  component: RouteComponent,
})

const buttonVariants = [
  'default',
  'secondary',
  'dark',
  'danger',
  'ghost',
  'disabled',
] as const
const buttonSizes = ['default', 'xs', 'sm', 'lg', 'xl'] as const
const buttonIconSizes = ['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const

const badgeVariants = [
  'blue',
  'green',
  'red',
  'orange',
  'purple',
  'yellow',
  'gray',
  'success',
  'dark',
] as const
const badgeSizes = ['pill', 'tag', 'chip', 'status', 'count', 'ratio'] as const

const priorityList: Priority[] = ['highest', 'high', 'medium', 'low', 'lowest']
const taskTypeList: TaskType[] = ['epic', 'story', 'task', 'bug']

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5 rounded-[18px] border border-border bg-white p-7">
      <h2 className="m-0 font-display text-[26px] font-extrabold tracking-[-0.02em] text-ink">
        {title}
      </h2>
      {children}
    </section>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="m-0 text-[13px] font-semibold uppercase tracking-[.06em] text-muted">
        {title}
      </h3>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-20 shrink-0 font-mono text-xs text-muted">{label}</span>
      {children}
    </div>
  )
}

function RouteComponent() {
  return (
    <div className="min-h-screen bg-page">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 py-10">
        <h1 className="m-0 font-display text-[34px] font-extrabold tracking-[-0.02em] text-ink">
          UI Kit
        </h1>

        <Section title="Кнопки">
          <Group title="variant × size">
            <div className="flex flex-col gap-3">
              {buttonSizes.map((size) => (
                <Row key={size} label={size}>
                  {buttonVariants.map((variant) => (
                    <Button key={variant} variant={variant} size={size}>
                      {variant}
                    </Button>
                  ))}
                </Row>
              ))}
            </div>
          </Group>
          <Group title="З іконкою">
            <Button>
              <Plus className="size-4" />
              Створити
            </Button>
            <Button variant="secondary">
              <Plus className="size-4" />
              Додати
            </Button>
          </Group>
          <Group title="Тільки іконка">
            {buttonIconSizes.map((size) => (
              <Button key={size} size={size} variant="secondary" aria-label={size}>
                <Plus />
              </Button>
            ))}
          </Group>
        </Section>

        <Section title="Поля форми">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="kit-input">Input</Label>
              <Input id="kit-input" placeholder="Назва проєкту" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="kit-input-invalid">Input · invalid</Label>
              <Input id="kit-input-invalid" aria-invalid defaultValue="Помилка" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="kit-input-disabled">Input · disabled</Label>
              <Input id="kit-input-disabled" disabled placeholder="Недоступно" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Select</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Оберіть команду" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Select · disabled</Label>
              <Select disabled>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Недоступно" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="x">x</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="kit-textarea">Textarea</Label>
              <Textarea id="kit-textarea" placeholder="Опис проєкту" />
            </div>
            <div className="flex flex-col gap-3">
              <Label>Switch</Label>
              <div className="flex items-center gap-4">
                <Switch />
                <Switch defaultChecked />
                <Switch disabled />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label>Slider</Label>
              <Slider defaultValue={[40]} max={100} />
            </div>
          </div>
        </Section>

        <Section title="Бейджі, мітки, іконки">
          <Group title="Badge · size × variant">
            <div className="flex flex-col gap-3">
              {badgeSizes.map((size) => (
                <Row key={size} label={size}>
                  {badgeVariants.map((variant) => (
                    <Badge key={variant} size={size} variant={variant}>
                      {size === 'count' ? '5' : size === 'ratio' ? '3 / 3' : variant}
                    </Badge>
                  ))}
                </Row>
              ))}
            </div>
          </Group>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
            <Group title="Шаблон проєкту">
              <TemplateBadge template="scrum" />
              <TemplateBadge template="kanban" />
              <TemplateBadge template="bug-tracking" />
            </Group>

            <Group title="Статус спринту">
              <SprintStatusBadge status="active" />
              <SprintStatusBadge status="planned" />
              <SprintStatusBadge status="closed" />
            </Group>

            <Group title="Пріоритет (pill)">
              {priorityList.map((p) => (
                <PriorityBadge key={p} priority={p} />
              ))}
            </Group>

            <Group title="Пріоритет (іконка)">
              {priorityList.map((p) => (
                <PriorityIcon key={p} priority={p} />
              ))}
            </Group>

            <Group title="Пріоритет (іконка + назва)">
              {priorityList.map((p) => (
                <PriorityLabel key={p} priority={p} />
              ))}
            </Group>

            <Group title="Тип задачі (іконка)">
              {taskTypeList.map((t) => (
                <TaskTypeIcon key={t} type={t} />
              ))}
            </Group>

            <Group title="Тип задачі (іконка + назва)">
              {taskTypeList.map((t) => (
                <TaskTypeLabel key={t} type={t} />
              ))}
            </Group>

            <Group title="Епік · SP · лічильник · ключ">
              <Badge variant="purple" size="tag">
                Автентифікація
              </Badge>
              <Badge variant="blue" size="tag">
                Scrum-планування
              </Badge>
              <Badge variant="orange" size="tag">
                Канбан-дошка
              </Badge>
              <Badge size="count">5</Badge>
              <Badge variant="orange" size="ratio">
                3 / 3
              </Badge>
              <IssueKey>KAI-17</IssueKey>
            </Group>

            <Group title="Колонка (чип)">
              <Badge size="chip">To Do</Badge>
              <Badge size="chip">In Progress</Badge>
              <Badge size="chip">Done</Badge>
              <Badge variant="yellow" size="chip" className="font-bold">
                НЕЗАБАРОМ
              </Badge>
            </Group>

            <Group title="Роль">
              <RoleBadge role="owner" />
              <RoleBadge role="admin" />
              <RoleBadge role="member" />
              <RoleBadge role="viewer" />
            </Group>
          </div>
        </Section>
      </div>
    </div>
  )
}
