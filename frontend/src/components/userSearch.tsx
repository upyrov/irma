import { useId, useState } from "react"
import { Spinner } from "#/components/ui/spinner"
import { colorFor, initialsOf } from "#/api/adapters"
import { teamErrorMessage, useSearchUsers } from "#/api/hooks/useTeams"
import { MIN_SEARCH_LENGTH } from "#/api/teams"
import type { Guid, UserDto } from "#/types/api"

type Props = {
  teamId: Guid
  excludeIds?: Guid[]
  onPick: (user: UserDto) => void
  actionLabel?: string
  disabled?: boolean
  autoFocus?: boolean
  onEscape?: () => void
  label?: string
}

export const UserSearch = ({
  teamId,
  excludeIds = [],
  onPick,
  actionLabel = "Додати",
  disabled,
  autoFocus,
  onEscape,
  label = "Пошук користувача",
}: Props) => {
  const inputId = useId()
  const listId = useId()
  const [search, setSearch] = useState("")
  const users = useSearchUsers(teamId, search)
  const q = search.trim()
  const active = q.length >= MIN_SEARCH_LENGTH
  const results = (users.data ?? []).filter((u) => !excludeIds.includes(u.id))

  const pick = (user: UserDto) => {
    onPick(user)
    setSearch("")
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <svg
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id={inputId}
          type="search"
          // biome-ignore lint/a11y/noAutofocus: поле відкривається діями користувача
          autoFocus={autoFocus}
          autoComplete="off"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && onEscape) {
              e.stopPropagation()
              if (search) setSearch("")
              else onEscape()
            }
            if (e.key === "Enter") {
              e.preventDefault()
              if (results.length > 0 && !disabled) pick(results[0])
            }
          }}
          placeholder={`Username, від ${MIN_SEARCH_LENGTH} символів`}
          aria-controls={active ? listId : undefined}
          className="h-10 w-full rounded-[10px] border border-border-input bg-white pr-3 pl-9 text-sm text-ink outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
        />
      </div>

      {active && (
        <ul
          id={listId}
          aria-busy={users.isFetching}
          className="flex max-h-48 flex-col overflow-y-auto rounded-[10px] border border-border bg-white p-1"
        >
          {users.isPending && (
            <li className="flex items-center gap-2 px-2 py-1.5 text-[13px] text-muted">
              <Spinner className="size-3.5" label="Пошук" /> Пошук…
            </li>
          )}
          {users.error && (
            <li className="px-2 py-1.5 text-[13px] text-danger-text">{teamErrorMessage(users.error)}</li>
          )}
          {users.isSuccess && results.length === 0 && (
            <li className="px-2 py-1.5 text-[13px] text-muted">Нікого не знайдено за «{q}»</li>
          )}
          {results.map((u) => (
            <li key={u.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => pick(u)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-hover focus-visible:bg-hover focus-visible:outline-none disabled:opacity-60"
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: colorFor(u.id) }}
                  aria-hidden="true"
                >
                  {initialsOf(u.username)}
                </span>
                <span className="flex-1 truncate">@{u.username}</span>
                <span className="text-xs font-semibold text-primary">{actionLabel}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
