import { Link } from "@tanstack/react-router"
import { colorFor } from "#/api/adapters"
import { useTeams } from "#/api/hooks/useTeams"

export const HomeProjectsTeamList = () => {
  const { data: teams = [] } = useTeams()

    return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between px-2.5">
        <span className="text-xs font-semibold uppercase tracking-[0.06em] text-muted">Мої команди</span>
        <Link
          to="/teams"
          aria-label="Створити команду"
          title="Створити команду"
          className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-hover hover:text-ink"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </Link>
      </div>

      <ul className="flex flex-col pt-2 pl-2">
        {teams.map((t) => (
          <li key={t.id} className="flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm text-ink hover:bg-hover">
            <span
              className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white"
              style={{ background: colorFor(t.id) }}
            >
              {t.name[0]}
            </span>
            <span className="flex-1 truncate font-semibold">{t.name}</span>
            <span className="text-xs font-semibold text-muted">{t.members.length} уч.</span>
          </li>
        ))}
      </ul>
    </div>
  );
}