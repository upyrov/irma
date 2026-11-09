import { teams } from "#/tempData"

export const TeamList = () => {
    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
        {teams.map((t) => (
        <article
          key={t.id}
          className="flex flex-col gap-4 rounded-[14px] border border-[#E3E6EB] bg-white p-5 text-[#16181D] hover:border-[#2F5BEA] hover:shadow-[0_6px_20px_rgba(22,24,29,0.08)]"
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] font-['Manrope',sans-serif] text-[15px] font-extrabold text-white"
              style={{ background: t.color }}
            >
              {t.name[0]}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-bold">{t.name}</h2>
              <div className="text-[13px] text-[#5B6270]">{t.members.length} учасників</div>
            </div>
            <button
              type="button"
              aria-label="Дії з командою"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5B6270] hover:bg-[#EEF0F4]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="5" cy="12" r="1.8" />
                <circle cx="12" cy="12" r="1.8" />
                <circle cx="19" cy="12" r="1.8" />
              </svg>
            </button>
          </div>
        
          <ul className="flex flex-col gap-2.5">
            {t.members.map((m) => (
              <li key={m.id} className="flex items-center gap-2.5">
                <span
                  className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                  style={{ background: m.color }}
                >
                  {m.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{m.name}</div>
                  <div className="text-xs text-[#5B6270]">@{m.usertag}</div>
                </div>
              </li>
            ))}
          </ul>
        
          <div className="flex items-center justify-between gap-2.5 border-t border-[#EEF0F4] pt-3.5">
            <span className="text-[13px] text-[#5B6270]">{t.projectsCount} проєкти</span>
            <button
              type="button"
              className="flex h-[34px] items-center gap-1.5 rounded-lg border border-[#D3D7DE] bg-white px-3 text-[13px] font-semibold text-[#16181D] hover:bg-[#F8F9FB]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Учасник
            </button>
          </div>
        </article>
             ))}
            </div>
    )
}