import { useState } from "react"
import { colorFor, initialsOf } from "#/api/adapters"
import { errorMessage } from "#/api/hooks/useAuth"
import { useUiProjects } from "#/api/hooks/useProjectView"
import { useAddTeamMember, useSearchUsers, useTeams } from "#/api/hooks/useTeams"
import type { TeamDto } from "#/types/api"

/** Пошук користувача за username і додавання в команду */
const AddMember = ({ teamId, onClose }: { teamId: string; onClose: () => void }) => {
  const [search, setSearch] = useState("")
  const users = useSearchUsers(teamId, search)
  const addMember = useAddTeamMember()

  return (
    <div className="flex flex-col gap-2 rounded-[10px] border border-border bg-[#FAFBFC] p-2.5">
      <input
        // biome-ignore lint/a11y/noAutofocus: поле відкривається кнопкою «Учасник»
        autoFocus
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        placeholder="Username, від 2 символів"
        className="h-9 rounded-lg border border-border-input bg-white px-3 text-sm outline-none focus:border-primary"
      />
      {search.trim().length >= 2 && (
        <ul className="flex max-h-48 flex-col overflow-y-auto">
          {users.data?.length === 0 && (
            <li className="px-1 py-1.5 text-[13px] text-muted">Нікого не знайдено</li>
          )}
          {users.data?.map((u) => (
            <li key={u.id}>
              <button
                type="button"
                disabled={addMember.isPending}
                onClick={() =>
                  addMember.mutate({ teamId, userId: u.id }, { onSuccess: () => setSearch("") })
                }
                className="flex w-full items-center gap-2 rounded-md px-1.5 py-1.5 text-left text-sm hover:bg-hover disabled:opacity-60"
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: colorFor(u.id) }}
                >
                  {initialsOf(u.username)}
                </span>
                <span className="flex-1 truncate">@{u.username}</span>
                <span className="text-xs font-semibold text-primary">Додати</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {addMember.error && (
        <p className="m-0 text-xs text-danger-text">{errorMessage(addMember.error)}</p>
      )}
    </div>
  )
}

const TeamCard = ({ team, projectsCount }: { team: TeamDto; projectsCount: number }) => {
  const [adding, setAdding] = useState(false)

  return (
    <article className="flex flex-col gap-4 rounded-[14px] border border-border bg-white p-5 text-ink hover:border-primary hover:shadow-[0_6px_20px_rgba(22,24,29,0.08)]">
      <div className="flex items-center gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] font-['Manrope',sans-serif] text-[15px] font-extrabold text-white"
          style={{ background: colorFor(team.id) }}
        >
          {team.name[0]}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-bold">{team.name}</h2>
          <div className="text-[13px] text-muted">{team.members.length} учасників</div>
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
              <div className="truncate text-sm font-semibold">{m.username}</div>
              <div className="text-xs text-muted">@{m.username}</div>
            </div>
          </li>
        ))}
      </ul>

      {adding && <AddMember teamId={team.id} onClose={() => setAdding(false)} />}

      <div className="flex items-center justify-between gap-2.5 border-t border-hover pt-3.5">
        <span className="text-[13px] text-muted">{projectsCount} проєкти</span>
        <button
          type="button"
          onClick={() => setAdding((a) => !a)}
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

export const TeamList = () => {
  const { data: teams, isPending, error } = useTeams()
  const { data: projects = [] } = useUiProjects()

  if (isPending) return <p className="text-sm text-muted">Завантаження команд…</p>
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
        />
      ))}
    </div>
  )
}
