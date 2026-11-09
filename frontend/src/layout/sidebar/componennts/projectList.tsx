import { projects } from "#/tempData"

export const ProjectList = () => {
    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
              {projects.map((p) => (
                <a
                  key={p.id}
                  href={`/projects/${p.id}/backlog`}
                  className="flex flex-col gap-4 rounded-[14px] border border-[#E3E6EB] bg-white p-5 text-[#16181D] no-underline hover:border-[#2F5BEA] hover:shadow-[0_6px_20px_rgba(22,24,29,0.08)]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] font-['Manrope',sans-serif] text-[15px] font-extrabold text-white"
                      style={{ background: p.color }}
                    >
                      {p.key[0]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-base font-bold">{p.name}</div>
                      <div className="font-['JetBrains_Mono',monospace] text-xs text-[#5B6270]">
                        {p.key} · {p.team}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        p.template === 'Scrum'
                          ? 'bg-[#E8EEFD] text-[#1E40B8]'
                          : p.template === 'Kanban'
                            ? 'bg-[#E6F4EC] text-[#17603C]'
                            : 'bg-[#FDECEC] text-[#9B1C1C]'
                      }`}
                    >
                      {p.template}
                    </span>
                  </div>
        
                  <p className="min-h-[42px] text-sm leading-normal text-[#3A404B]">{p.description}</p>
        
                  <div className="flex items-center justify-between border-t border-[#EEF0F4] pt-3.5">
                    <div className="flex">
                      {p.members.map((m) => (
                        <span
                          key={m.id}
                          className="-mr-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white"
                          style={{ background: m.color }}
                        >
                          {m.initials}
                        </span>
                      ))}
                    </div>
                    <span className="text-[13px] text-[#5B6270]">{p.stat}</span>
                  </div>
                </a>
              ))}
        
              <button
                type="button"
                className="flex min-h-[196px] flex-col items-center justify-center gap-2.5 rounded-[14px] border-[1.5px] border-dashed border-[#C3C8D1] text-[15px] font-semibold text-[#3A404B] hover:border-[#2F5BEA]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8EEFD] text-[#2F5BEA]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
                Новий проєкт
              </button>
        
        
            </div>
    )
}