import { DropdownMenu } from 'radix-ui';
import { Check, ChevronDown } from 'lucide-react';

const projects = [
  { id: '1', name: 'Jira-аналог (курсова)', template: 'Scrum', key: 'KAI', color: '#2F5BEA' },
  { id: '2', name: 'Мобільний клієнт', template: 'Kanban', key: 'MOB', color: '#1F7A4D' },
  { id: '3', name: 'API Gateway', template: 'Scrum', key: 'API', color: '#7A4FD6' },
];

export function ProjectSwitcher() {
  const current = projects[0];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-xl border border-[#E3E6EB] p-2.5 text-left outline-none hover:bg-[#F8F9FB] focus-visible:ring-[3px] focus-visible:ring-[#2F5BEA]/30 data-[state=open]:border-[#2F5BEA]"
        >
          <span
            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] font-['Manrope',sans-serif] font-extrabold text-white"
            style={{ background: current.color }}
          >
            {current.key[0]}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold text-[#16181D]">{current.name}</div>
            <div className="text-xs text-[#5B6270]">
              {current.template} · {current.key}
            </div>
          </div>
          <ChevronDown size={16} className="shrink-0 text-[#5B6270]" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-50 w-[var(--radix-dropdown-menu-trigger-width)] rounded-xl border border-[#E3E6EB] bg-white p-1 shadow-[0_12px_32px_rgba(22,24,29,0.12)]"
        >
          {projects.map((p) => (
            <DropdownMenu.Item
              key={p.id}
              className="flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 outline-none data-[highlighted]:bg-[#EEF0F4]"
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] text-xs font-extrabold text-white"
                style={{ background: p.color }}
              >
                {p.key[0]}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-[#16181D]">{p.name}</div>
                <div className="text-xs text-[#5B6270]">
                  {p.template} · {p.key}
                </div>
              </div>
              {p.id === current.id && <Check size={16} className="shrink-0 text-[#2F5BEA]" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}