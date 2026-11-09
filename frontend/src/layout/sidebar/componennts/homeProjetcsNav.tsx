import { Link } from "@tanstack/react-router"

export const HomeProjectsNav = () => {

    return (
        <nav className="flex flex-col gap-0.5 ">
            <Link to="/" aria-current="page" className="flex h-10 items-center gap-2.5 rounded-lg bg-[#E8EEFD] px-2.5 text-sm font-semibold text-black no-underline">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M4 6h16M4 12h16M4 18h10" />
                </svg>
                Проєкти
            </Link>
        
          <Link to="/teams" className="flex h-10 items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium text-black no-underline hover:bg-[#EEF0F4]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M9 4v16M15 4v16" />
                </svg>
                Команди
          </Link>
        </nav>
    )
}