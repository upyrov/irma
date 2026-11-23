import { useEffect, useRef, useState } from "react"
import { Spinner } from "#/components/ui/spinner"
import { PageSpinner } from "#/components/ui/spinner"
import { colorFor, initialsOf } from "#/api/adapters"
import { errorMessage, useMe } from "#/api/hooks/useAuth"
import { useUiProjects } from "#/api/hooks/useProjectView"
import { teamErrorMessage, useAddTeamMember, useTeams } from "#/api/hooks/useTeams"
import { UserSearch } from "#/components/userSearch"
import type { Guid, TeamDto } from "#/types/api"

const AddMember = ({ teamId, onClose }: { teamId: string; onClose: () => void }) => {
  const addMember = useAddTeamMember()
  const [added, setAdded] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-2 rounded-[10px] border border-border bg-[#FAFBFC] p-2.5">
      <UserSearch
        teamId={teamId}
        autoFocus
        onEscape={onClose}
        disabled={addMember.isPending}
        label="Знайти користувача, щоб додати в команду"
        onPick={(u) =>
          addMember.mutate(
            { teamId, userId: u.id },
            { onSuccess: () => setAdded(u.username) },
          )
        }
      />
      {addMember.isPending && (
        <p className="m-0 flex items-center gap-1.5 text-xs text-muted">
          <Spinner className="size-3" label="Додаємо" /> Додаємо…
        </p>
      )}
      {addMember.isSuccess && added && (
        <p className="m-0 text-xs text-success-text" aria-live="polite">@{added} тепер у команді</p>
      )}
      {addMember.error && (
        <p className="m-0 text-xs text-danger-text" role="alert">{teamErrorMessage(addMember.error)}</p>
      )}
    </div>
  )
}

const projectsLabel = (n: number) => {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return `${n} проєкт`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} проєкти`
  return `${n} проєктів`
}

const membersLabel = (n: number) => {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return `${n} учасник`
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} учасники`
  return `${n} учасників`
}

type CardProps = { team: TeamDto; projectsCount: number; meId?: Guid; highlighted?: boolean }

const TeamCard = ({ team, projectsCount, meId, highlighted }: CardProps) => {
  const [adding, setAdding] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (highlighted) ref.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [highlighted])

  return (
    <article
      ref={ref}
      className={`flex flex-col gap-4 rounded-[14px] border bg-white p-5 text-ink transition-shadow hover:border-primary hover:shadow-[0_6px_20px_rgba(22,24,29,0.08)] ${highlighted ? "border-primary ring-[3px] ring-primary/20" : "border-border"}`}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] font-['Manrope',sans-serif] text-[15px] font-extrabold text-white"
          style={{ background: colorFor(team.id) }}
        >
          {team.name[0]}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold">{team.name}</h2>
          <div className="text-[13px] text-muted">{membersLabel(team.members.length)}</div>
        </div>
      </div>

      <ul className="flex flex-col gap-2.5">
        {team.members.map((m) => (
          <li key={m.id} className="flex items-center gap-2.5">
            <span
              className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ background: colorFor(m.id) }}
            >
              {initialsOf(m.username)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">
                {m.username}
                {m.id === meId && <span className="ml-1.5 font-normal text-muted">(ви)</span>}
              </div>
              <div className="text-xs text-muted">@{m.username}</div>
            </div>
          </li>
        ))}
      </ul>

      {adding && <AddMember teamId={team.id} onClose={() => setAdding(false)} />}

      <div className="flex items-center justify-between gap-2.5 border-t border-hover pt-3.5">
        <span className="text-[13px] text-muted">{projectsLabel(projectsCount)}</span>
        <button
          type="button"
          onClick={() => setAdding((a) => !a)}
          aria-expanded={adding}
          className="flex h-[34px] items-center gap-1.5 rounded-lg border border-border-input bg-white px-3 text-[13px] font-semibold text-ink hover:bg-[#F8F9FB]"
        >
          {adding ? (
            "Готово"
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Учасник
            </>
          )}
        </button>
      </div>
    </article>
  )
}

export const TeamList = ({ highlightId }: { highlightId?: Guid | null }) => {
  const { data: teams, isPending, error } = useTeams()
  const { data: me } = useMe()
  const { data: projects = [] } = useUiProjects()

  if (isPending) return <PageSpinner label="Завантаження команд" />
  if (error) return <p className="text-sm text-danger-text">{errorMessage(error)}</p>
  if (teams.length === 0)
    return <p className="text-sm text-muted">Ви ще не в жодній команді — створіть першу.</p>

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
      {teams.map((t) => (
        <TeamCard
          key={t.id}
          team={t}
          projectsCount={projects.filter((p) => p.teamId === t.id).length}
          meId={me?.id}
          highlighted={t.id === highlightId}
        />
      ))}
    </div>
  )
}
