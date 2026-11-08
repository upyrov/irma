import { ProjectSwitcher } from "./componennts/dropdown";
import { Logo } from "./componennts/Logo";
import { Navigation } from "./componennts/navigation";
import { User } from "./componennts/user";

export function Sidebar() {

    return (
  <aside className="box-border flex max-w-80 h-screen flex-[1_1_248px] flex-col gap-5 border-r border-[#E3E6EB] bg-white px-3.5 py-5">
    {/* logo */}
      <Logo/>
      <ProjectSwitcher />
      <Navigation />
  
    <div className="mt-auto flex items-center gap-2.5 border-t border-[#E3E6EB] p-2.5">
      <User/>
      <a href="/login" aria-label="Вийти" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5B6270]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10" />
        </svg>
      </a>
    </div>
  </aside>
);
}