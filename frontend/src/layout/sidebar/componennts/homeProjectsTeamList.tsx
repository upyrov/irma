import { teams } from "#/tempData"

export const HomeProjectsTeamList = () => {

    return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between px-2.5">
        <span className="text-xs font-semibold uppercase tracking-[0.06em] text-[#5B6270]">Мої команди</span>
        <button
          type="button"
          aria-label="Створити команду"
          className="flex h-7 w-7 items-center justify-center rounded-md text-[#5B6270] hover:bg-[#EEF0F4] hover:text-[#16181D]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      <ul className="flex flex-col pt-2 pl-2">
        {teams.map((t) => (
          <li key={t.id} className="flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-sm text-[#16181D] hover:bg-[#EEF0F4]">
            <span
              className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white"
              style={{ background: t.color }}
            >
              {t.name[0]}
            </span>
            <span className="flex-1 truncate font-semibold">{t.name}</span>
            <span className="text-xs font-semibold text-[#5B6270]">{t.members.length} уч.</span>
          </li>
        ))}
      </ul>
    </div>
  );
}