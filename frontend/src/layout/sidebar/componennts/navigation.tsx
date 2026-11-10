export const Navigation = () => {

    return (
        <nav className="flex flex-col gap-0.5">
      <span className="px-2.5 pb-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-muted">Планування</span>

      <a href="/projects/1/backlog" aria-current="page" className="flex h-10 items-center gap-2.5 rounded-lg bg-primary-tint px-2.5 text-sm font-semibold text-primary-hover no-underline">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
        Беклог
      </a>

      <a href="/projects/1/board" className="flex h-10 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium text-text-2 no-underline hover:bg-hover">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M9 4v16M15 4v16" />
        </svg>
        Активна дошка
      </a>

      <a href="/projects/1/settings" className="flex h-10 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium text-text-2 no-underline hover:bg-hover">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
          <circle cx="16" cy="7" r="2" />
          <circle cx="10" cy="17" r="2" />
        </svg>
        Налаштування
      </a>
    </nav>
    )
}
