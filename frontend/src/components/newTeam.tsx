import { type FormEvent, useState } from "react"
import { Spinner } from "./ui/spinner"
import { colorFor, initialsOf } from "#/api/adapters"
import { useMe } from "#/api/hooks/useAuth"
import { teamErrorMessage, useAddTeamMember, useCreateTeam, useTeams } from "#/api/hooks/useTeams"
import { TEAM_NAME_MAX_LENGTH } from "#/api/teams"
import { useDialog } from "#/lib/useDialog"
import type { TeamDto, UserDto } from "#/types/api"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { UserSearch } from "./userSearch"

type Props = {
  onClose: () => void
  onCreated?: (team: TeamDto) => void
}

const MemberRow = ({ user, note }: { user: UserDto; note?: string }) => (
  <li className="flex items-center gap-2.5 py-1">
    <span
      className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
      style={{ background: colorFor(user.id) }}
      aria-hidden="true"
    >
      {initialsOf(user.username)}
    </span>
    <span className="min-w-0 flex-1 truncate text-sm font-semibold">@{user.username}</span>
    {note && <span className="text-xs text-muted">{note}</span>}
  </li>
)

export const NewTeam = ({ onClose, onCreated }: Props) => {
  const { data: me } = useMe()
  const { data: teams = [] } = useTeams()
  const createTeam = useCreateTeam()
  const addMember = useAddTeamMember()

  const [name, setName] = useState("")
  const [touched, setTouched] = useState(false)
  const [created, setCreated] = useState<TeamDto | null>(null)
  const [lastAdded, setLastAdded] = useState<string | null>(null)

  const close = () => {
    if (createTeam.isPending) return
    if (created) onCreated?.(created)
    onClose()
  }
  const dialogRef = useDialog<HTMLFormElement>(close)

  const team = created ? (teams.find((t) => t.id === created.id) ?? created) : null

  const trimmed = name.trim()
  const nameError = !trimmed
    ? "Вкажіть назву команди"
    : trimmed.length > TEAM_NAME_MAX_LENGTH
      ? `Назва — до ${TEAM_NAME_MAX_LENGTH} символів`
      : null
  const showNameError = touched && nameError

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (created) return close()
    setTouched(true)
    if (nameError || createTeam.isPending) return
    createTeam.mutate({ name: trimmed }, { onSuccess: setCreated })
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: клік по фону — дубль кнопки «Закрити», з клавіатури є Esc
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/55 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <form
        ref={dialogRef}
        onSubmit={submit}
        noValidate
        role="dialog"
        aria-modal="true"
        aria-labelledby="ct-title"
        aria-describedby="ct-desc"
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-[520px] flex-col rounded-[18px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.3)]"
      >
        <div className="flex items-start justify-between gap-4 px-7 pt-6">
          <div>
            <p className="m-0 mb-1 text-xs font-semibold uppercase tracking-[0.06em] text-muted">
              Крок {team ? 2 : 1} з 2
            </p>
            <h2 id="ct-title" className="mb-1.5 font-['Manrope',sans-serif] text-2xl font-extrabold tracking-[-0.02em]">
              {team ? "Додайте учасників" : "Нова команда"}
            </h2>
            <p id="ct-desc" className="text-sm text-muted">
              {team
                ? `Команду «${team.name}» створено. Знайдіть колег за username — або зробіть це пізніше з картки команди.`
                : "Учасники команди зможуть створювати її проєкти та отримувати в них ролі."}
            </p>
          </div>
          <button
            type="button"
            aria-label="Закрити"
            disabled={createTeam.isPending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] text-muted hover:bg-hover disabled:opacity-60"
            onClick={close}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {team ? (
          <div className="flex flex-col gap-3 overflow-y-auto px-7 py-6">
            <UserSearch
              teamId={team.id}
              autoFocus
              disabled={addMember.isPending}
              label="Знайти користувача, щоб додати в команду"
              onPick={(u) =>
                addMember.mutate(
                  { teamId: team.id, userId: u.id },
                  { onSuccess: () => setLastAdded(u.username) },
                )
              }
            />
            <div aria-live="polite" className="min-h-[18px] text-xs">
              {addMember.isPending && (
                <span className="flex items-center gap-1.5 text-muted">
                  <Spinner className="size-3" label="Додаємо" /> Додаємо…
                </span>
              )}
              {addMember.isSuccess && lastAdded && (
                <span className="text-success-text">@{lastAdded} тепер у команді</span>
              )}
              {addMember.error && (
                <span className="text-danger-text">{teamErrorMessage(addMember.error)}</span>
              )}
            </div>
            <ul className="flex flex-col">
              {team.members.map((m) => (
                <MemberRow key={m.id} user={m} note={m.id === me?.id ? "ви · творець" : undefined} />
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 px-7 py-6">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="ct-name">Назва команди</Label>
              <span
                className={`text-xs ${trimmed.length > TEAM_NAME_MAX_LENGTH ? "text-danger-text" : "text-muted"}`}
                aria-hidden="true"
              >
                {trimmed.length}/{TEAM_NAME_MAX_LENGTH}
              </span>
            </div>
            <input
              id="ct-name"
              type="text"
              // biome-ignore lint/a11y/noAutofocus: перше поле щойно відкритого вікна
              autoFocus
              value={name}
              disabled={createTeam.isPending}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => name && setTouched(true)}
              placeholder="Напр. Команда КАІ"
              aria-invalid={!!showNameError}
              aria-describedby={showNameError ? "ct-name-error" : undefined}
              className="h-11 rounded-[10px] border border-border-input px-3.5 text-[15px] text-ink outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20 aria-[invalid=true]:border-danger-text"
            />
            {showNameError && (
              <p id="ct-name-error" className="m-0 text-[13px] text-danger-text">
                {nameError}
              </p>
            )}
            {createTeam.error && (
              <p role="alert" className="m-0 text-[13px] text-danger-text">
                {teamErrorMessage(createTeam.error)}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-2.5 rounded-b-[18px] border-t border-border bg-[#FAFBFC] px-7 py-4">
          {team ? (
            <Button type="submit">Готово</Button>
          ) : (
            <>
              <Button type="button" variant="secondary" onClick={close} disabled={createTeam.isPending}>
                Скасувати
              </Button>
              <Button type="submit" disabled={createTeam.isPending}>
                {createTeam.isPending ? "Створення…" : "Створити й далі"}
              </Button>
            </>
          )}
        </div>
      </form>
    </div>
  )
}
