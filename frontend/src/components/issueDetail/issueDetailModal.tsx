import { X } from "lucide-react"
import { Dialog } from "radix-ui"
import { type FormEvent, type ReactNode, useEffect, useState } from "react"
import { type Project, toAssignee, toServerPriority, toUiPriority, toUiType } from "#/api/adapters"
import { errorMessage } from "#/api/hooks/useAuth"
import { useAddComment, useComments, useIssue, useUpdateIssue } from "#/api/hooks/useIssues"
import type { ProjectView } from "#/api/hooks/useProjectView"
import { issueFormConfig } from "#/components/createIssue/formConfig"
import { PriorityPicker } from "#/components/createIssue/priorityPicker"
import { StoryPointsPicker } from "#/components/createIssue/storyPointsPicker"
import { Avatar } from "#/components/ui/avatar"
import { IssueKey } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import { TaskTypeLabel } from "#/components/ui/task-type"
import { Textarea } from "#/components/ui/textarea"
import type { IssueUpdateDto } from "#/types/api"

// Radix Select не приймає порожнє значення
const NONE = "__none__"

type Props = {
  /** null — модалка закрита */
  issueId: string | null
  onClose: () => void
  view: ProjectView
  project: Pick<Project, "id" | "template">
}

const Field = ({ id, label, children }: { id: string; label: ReactNode; children: ReactNode }) => (
  <div className="flex min-w-0 flex-col gap-1.5">
    <Label htmlFor={id}>{label}</Label>
    {children}
  </div>
)

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("uk-UA", { dateStyle: "medium", timeStyle: "short" })

/**
 * Деталі задачі: GET /api/issues/{id}, редагування через PUT /api/issues/{id},
 * коментарі — GET / POST /api/issues/{id}/comments.
 */
export const IssueDetailModal = ({ issueId, onClose, view, project }: Props) => {
  const issueQ = useIssue(issueId ?? undefined)
  const commentsQ = useComments(issueId ?? undefined)
  const update = useUpdateIssue(project.id)
  const addComment = useAddComment(issueId ?? "")
  const config = issueFormConfig[project.template]
  const issue = issueQ.data

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [comment, setComment] = useState("")

  // Підтягуємо текст у поля, коли задача завантажилась або відкрили іншу
  useEffect(() => {
    if (!issue) return
    setTitle(issue.title)
    setDescription(issue.description ?? "")
  }, [issue])

  // biome-ignore lint/correctness/useExhaustiveDependencies: скидаємо стан при зміні задачі
  useEffect(() => {
    setComment("")
    update.reset()
    addComment.reset()
  }, [issueId])

  const save = (dto: IssueUpdateDto) => issueId && update.mutate({ issueId, dto })

  const saveTitle = () => {
    const trimmed = title.trim()
    if (!issue) return
    if (!trimmed) return setTitle(issue.title)
    if (trimmed !== issue.title) save({ title: trimmed })
  }

  const saveDescription = () => {
    if (!issue) return
    const next = description.trim()
    if (next !== (issue.description ?? "")) save({ description: next })
  }

  const submitComment = (e: FormEvent) => {
    e.preventDefault()
    const text = comment.trim()
    if (!text) return
    addComment.mutate({ text }, { onSuccess: () => setComment("") })
  }

  const isEpic = issue?.issueType === "Epic"
  const showEpic = config.fields.epic && !isEpic && view.epics.length > 0
  const error = issueQ.error ?? update.error ?? addComment.error

  return (
    <Dialog.Root open={issueId !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/55 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[860px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[18px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.3)] outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          {/* Шапка */}
          <div className="flex items-center justify-between gap-4 border-b border-border px-7 py-4">
            <Dialog.Title className="m-0 flex items-center gap-3 text-base font-normal">
              {issue ? (
                <>
                  <TaskTypeLabel type={toUiType(issue.issueType)} />
                  <IssueKey>{issue.issueKey}</IssueKey>
                </>
              ) : (
                <span className="text-sm text-muted">Задача</span>
              )}
            </Dialog.Title>
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

          {error && (
            <div role="alert" className="mx-7 mt-4 rounded-lg bg-danger-bg px-4 py-2.5 text-sm text-danger-text">
              {errorMessage(error)}
            </div>
          )}

          {!issue ? (
            <p className="m-0 px-7 py-6 text-sm text-muted">
              {issueQ.isPending ? "Завантаження…" : "Задачу не знайдено."}
            </p>
          ) : (
            <div className="grid min-h-0 flex-1 gap-6 overflow-y-auto px-7 py-6 md:grid-cols-[minmax(0,1fr)_260px]">
              {/* Ліва колонка: текст і коментарі */}
              <div className="flex min-w-0 flex-col gap-5">
                <Input
                  aria-label="Назва"
                  maxLength={300}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={saveTitle}
                  onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                  className="h-auto border-transparent px-2 py-1 font-display text-[22px] font-extrabold tracking-[-0.02em] hover:border-border-input"
                />

                <Field id="id-desc" label="Опис">
                  <Textarea
                    id="id-desc"
                    rows={5}
                    maxLength={4000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={saveDescription}
                    placeholder="Додайте опис…"
                    className="min-h-[120px] leading-normal"
                  />
                </Field>

                <section aria-label="Коментарі" className="flex flex-col gap-3">
                  <h3 className="m-0 text-sm font-semibold">
                    Коментарі{commentsQ.data ? ` · ${commentsQ.data.length}` : ""}
                  </h3>

                  <form onSubmit={submitComment} className="flex flex-col gap-2">
                    <Textarea
                      aria-label="Новий коментар"
                      rows={2}
                      maxLength={4000}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Напишіть коментар…"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="self-end"
                      disabled={!comment.trim() || addComment.isPending}
                    >
                      Надіслати
                    </Button>
                  </form>

                  {commentsQ.isPending ? (
                    <p className="m-0 text-sm text-muted">Завантаження…</p>
                  ) : commentsQ.data?.length === 0 ? (
                    <p className="m-0 text-sm text-muted">Коментарів ще немає.</p>
                  ) : (
                    <ul className="m-0 flex list-none flex-col gap-4 p-0">
                      {[...(commentsQ.data ?? [])]
                        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                        .map((c) => {
                          const author = toAssignee(c.author)
                          return (
                            <li key={c.id} className="flex gap-3">
                              <Avatar initials={author.initials} color={author.color} />
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-baseline gap-2 text-[13px]">
                                  <span className="font-semibold">{author.name}</span>
                                  <span className="text-muted">{formatDate(c.createdAt)}</span>
                                </div>
                                <p className="m-0 mt-0.5 whitespace-pre-wrap break-words text-sm">
                                  {c.text}
                                </p>
                              </div>
                            </li>
                          )
                        })}
                    </ul>
                  )}
                </section>
              </div>

              {/* Права колонка: атрибути */}
              <div className="flex min-w-0 flex-col gap-4">
                <Field id="id-stage" label="Статус">
                  <Select value={issue.stageId} onValueChange={(stageId) => save({ stageId })}>
                    <SelectTrigger id="id-stage" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {view.stages.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field id="id-assignee" label="Виконавець">
                  <Select
                    value={issue.assignee?.id ?? NONE}
                    onValueChange={(v) => save({ assigneeId: v === NONE ? null : v })}
                  >
                    <SelectTrigger id="id-assignee" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>Не призначено</SelectItem>
                      {view.members.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          <span className="flex items-center gap-2">
                            <Avatar initials={m.initials} color={m.color} className="size-5 text-[8px]" />
                            {m.name}
                            {m.id === view.currentUserId && <span className="text-muted">(я)</span>}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                {showEpic && (
                  <Field id="id-epic" label="Епік">
                    <Select
                      value={issue.epicId ?? NONE}
                      onValueChange={(v) => save({ epicId: v === NONE ? null : v })}
                    >
                      <SelectTrigger id="id-epic" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={NONE}>Без епіка</SelectItem>
                        {view.epics.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.key} · {e.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}

                <PriorityPicker
                  value={toUiPriority(issue.priority)}
                  onChange={(p) => save({ priority: toServerPriority(p) })}
                />

                {config.fields.storyPoints && (
                  <StoryPointsPicker
                    value={issue.storyPoints}
                    onChange={(storyPoints) => save({ storyPoints })}
                  />
                )}

                <p className="m-0 text-xs text-muted">Створено {formatDate(issue.createdAt)}</p>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
