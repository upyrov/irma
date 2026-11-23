import { X } from "lucide-react"
import { Dialog } from "radix-ui"
import { type FormEvent, type ReactNode, useEffect, useRef, useState } from "react"
import type { Assignee, Epic, Sprint, Stage } from "#/components/ProjectTemplate/Scrum/backlog/types"
import { Avatar } from "#/components/ui/avatar"
import { IssueKey } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"
import type { Priority } from "#/components/ui/priority"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import type { TaskType } from "#/components/ui/task-type"
import { Textarea } from "#/components/ui/textarea"
import type { Project } from "#/api/adapters"
import { issueFormConfig } from "./formConfig"
import { PriorityPicker } from "./priorityPicker"
import { StoryPointsPicker } from "./storyPointsPicker"
import { TypePicker } from "./typePicker"
import type { NewIssueDefaults, NewIssueValues } from "./types"

// Radix Select не приймає порожнє значення — позначаємо «нічого» окремим рядком
const NONE = "__none__"
const fromSelect = (v: string) => (v === NONE ? null : v)

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Pick<Project, "name" | "key" | "color" | "template">
  /** Ключ, який отримає задача, напр. KAI-27 */
  nextKey: string
  stages: Stage[]
  members: Assignee[]
  currentUserId?: string
  epics?: Epic[]
  /** Спринти, у які можна додати задачу (лише Scrum) */
  sprints?: Sprint[]
  defaults?: NewIssueDefaults
  onCreate: (values: NewIssueValues) => void
}

const Field = ({ id, label, children }: { id: string; label: ReactNode; children: ReactNode }) => (
  <div className="flex min-w-0 flex-col gap-1.5">
    <Label htmlFor={id}>{label}</Label>
    {children}
  </div>
)

export const CreateIssueModal = ({
  open,
  onOpenChange,
  project,
  nextKey,
  stages,
  members,
  currentUserId,
  epics = [],
  sprints = [],
  defaults,
  onCreate,
}: Props) => {
  const config = issueFormConfig[project.template]
  // Поле показуємо, лише якщо шаблон його підтримує і є з чого вибирати
  const showEpic = config.fields.epic && epics.length > 0
  const showSprint = config.fields.sprint && sprints.length > 0

  const initial = () => ({
    type: (defaults?.type && config.types.includes(defaults.type)
      ? defaults.type
      : config.defaultType) as TaskType,
    title: "",
    description: "",
    stageId: defaults?.stageId ?? stages[0]?.id ?? "",
    priority: "medium" as Priority,
    assigneeId: NONE,
    epicId: defaults?.epicId ?? NONE,
    sprintId: defaults?.sprintId ?? NONE,
    storyPoints: null as number | null,
  })

  const [form, setForm] = useState(initial)
  const [createAnother, setCreateAnother] = useState(false)
  const [titleError, setTitleError] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  // Щоразу при відкритті — чиста форма з потрібними значеннями за замовчуванням
  // biome-ignore lint/correctness/useExhaustiveDependencies: скидаємо лише при відкритті
  useEffect(() => {
    if (open) {
      setForm(initial())
      setTitleError(false)
    }
  }, [open])

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const isEpic = form.type === "epic"

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const title = form.title.trim()
    if (!title) {
      setTitleError(true)
      titleRef.current?.focus()
      return
    }

    onCreate({
      type: form.type,
      title,
      description: form.description.trim() || null,
      stageId: form.stageId,
      priority: form.priority,
      assigneeId: fromSelect(form.assigneeId),
      // Приховані поля не передаємо; у епіка не може бути батьківського епіка
      epicId: showEpic && !isEpic ? fromSelect(form.epicId) : null,
      sprintId: showSprint ? fromSelect(form.sprintId) : null,
      storyPoints: config.fields.storyPoints ? form.storyPoints : null,
    })

    if (createAnother) {
      // Лишаємо тип, статус, спринт тощо — очищаємо лише текст
      setForm((f) => ({ ...f, title: "", description: "" }))
      titleRef.current?.focus()
    } else {
      onOpenChange(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/55 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            titleRef.current?.focus()
          }}
          className="fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[680px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[18px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.3)] outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
            {/* Шапка */}
            <div className="flex items-start justify-between gap-4 border-b border-border px-7 pt-6 pb-5">
              <div className="min-w-0">
                <Dialog.Title className="m-0 mb-2 font-display text-2xl font-extrabold tracking-[-0.02em]">
                  {config.title}
                </Dialog.Title>
                <span className="inline-flex h-7 max-w-full items-center gap-2 rounded-lg border border-border pr-2.5 pl-1 text-[13px] text-text-2">
                  <span
                    className="flex size-5 shrink-0 items-center justify-center rounded-md font-display text-[11px] font-extrabold text-white"
                    style={{ background: project.color }}
                  >
                    {project.key[0]}
                  </span>
                  <span className="truncate">{project.name}</span>·
                  <IssueKey className="text-xs">{nextKey}</IssueKey>
                </span>
              </div>
              <Dialog.Close asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-lg"
                  aria-label="Закрити"
                  className="-mr-2 shrink-0 rounded-[10px] px-0 text-muted hover:bg-hover hover:text-ink"
                >
                  <X className="size-5" />
                </Button>
              </Dialog.Close>
            </div>

            {/* Поля — прокручуються, шапка й кнопки лишаються на місці */}
            <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-7 py-6">
              {config.types.length > 1 && (
                <TypePicker types={config.types} value={form.type} onChange={(t) => set("type", t)} />
              )}

              <Field
                id="ci-name"
                label={
                  <>
                    Назва <span aria-hidden="true" className="text-danger">*</span>
                  </>
                }
              >
                <Input
                  ref={titleRef}
                  id="ci-name"
                  required
                  maxLength={300}
                  value={form.title}
                  onChange={(e) => {
                    set("title", e.target.value)
                    setTitleError(false)
                  }}
                  placeholder={config.titlePlaceholder}
                  aria-invalid={titleError}
                  aria-describedby={titleError ? "ci-name-error" : undefined}
                />
                {titleError && (
                  <span id="ci-name-error" role="alert" className="text-[13px] text-danger-text">
                    Вкажіть назву
                  </span>
                )}
              </Field>

              <Field
                id="ci-desc"
                label={
                  <>
                    Опис <span className="font-normal text-muted">— необов'язково</span>
                  </>
                }
              >
                <Textarea
                  id="ci-desc"
                  rows={3}
                  maxLength={4000}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder={config.descriptionPlaceholder}
                  className="min-h-[88px] leading-normal"
                />
              </Field>

              <PriorityPicker value={form.priority} onChange={(p) => set("priority", p)} />

              {/* Дві колонки; якщо полів непарна кількість — останнє на всю ширину */}
              <div className="grid gap-4 sm:grid-cols-2 sm:[&>:last-child:nth-child(odd)]:col-span-2">
                <Field id="ci-stage" label="Статус">
                  <Select value={form.stageId} onValueChange={(v) => set("stageId", v)}>
                    <SelectTrigger id="ci-stage" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {stages.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field id="ci-assignee" label="Виконавець">
                  <Select value={form.assigneeId} onValueChange={(v) => set("assigneeId", v)}>
                    <SelectTrigger id="ci-assignee" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>Не призначено</SelectItem>
                      {members.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          <span className="flex items-center gap-2">
                            <Avatar initials={m.initials} color={m.color} className="size-5 text-[8px]" />
                            {m.name}
                            {m.id === currentUserId && <span className="text-muted">(я)</span>}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                {showEpic && !isEpic && (
                  <Field id="ci-epic" label="Епік">
                    <Select value={form.epicId} onValueChange={(v) => set("epicId", v)}>
                      <SelectTrigger id="ci-epic" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE}>Без епіка</SelectItem>
                        {epics.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.key} · {e.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}

                {showSprint && (
                  <Field id="ci-sprint" label="Спринт">
                    <Select value={form.sprintId} onValueChange={(v) => set("sprintId", v)}>
                      <SelectTrigger id="ci-sprint" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE}>Беклог (без спринту)</SelectItem>
                        {sprints.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name} · {s.status === "active" ? "Active" : "Planned"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              </div>

              {config.fields.storyPoints && (
                <StoryPointsPicker
                  value={form.storyPoints}
                  onChange={(v) => set("storyPoints", v)}
                />
              )}
            </div>

            {/* Дії */}
            <div className="flex flex-wrap items-center gap-2.5 rounded-b-[18px] border-t border-border bg-[#FAFBFC] px-7 py-4">
              <label className="mr-auto flex cursor-pointer items-center gap-2 text-sm text-text-2">
                <input
                  type="checkbox"
                  checked={createAnother}
                  onChange={(e) => setCreateAnother(e.target.checked)}
                  className="m-0 size-[18px] accent-primary"
                />
                Створити ще одну
              </label>
              <Dialog.Close asChild>
                <Button type="button" variant="secondary">
                  Скасувати
                </Button>
              </Dialog.Close>
              <Button
                type="submit"
                variant={project.template === "Bug tracking" ? "danger" : "default"}
              >
                {config.submitLabel}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
