import { DropdownMenu } from 'radix-ui';
import { Check, ChevronDown } from 'lucide-react';

const projects = [
  { id: '1', name: 'Jira-аналог (курсова)', template: 'Scrum', key: 'KAI', color: 'var(--color-primary)' },
  { id: '2', name: 'Мобільний клієнт', template: 'Kanban', key: 'MOB', color: 'var(--color-success)' },
  { id: '3', name: 'API Gateway', template: 'Scrum', key: 'API', color: 'var(--color-epic)' },
];

export function ProjectSwitcher() {
  const current = projects[0];

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-xl border border-border p-2.5 text-left outline-none hover:bg-[#F8F9FB] focus-visible:ring-[3px] focus-visible:ring-primary/30 data-[state=open]:border-primary"
        >
          <span
            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[9px] font-['Manrope',sans-serif] font-extrabold text-white"
            style={{ background: current.color }}
          >
            {current.key[0]}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold text-ink">{current.name}</div>
            <div className="text-xs text-muted">
              {current.template} · {current.key}
            </div>
          </div>
          <ChevronDown size={16} className="shrink-0 text-muted" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={6}
          className="z-50 w-[var(--radix-dropdown-menu-trigger-width)] rounded-xl border border-border bg-white p-1 shadow-[0_12px_32px_rgba(22,24,29,0.12)]"
        >
          {projects.map((p) => (
            <DropdownMenu.Item
              key={p.id}
              className="flex cursor-pointer select-none items-center gap-2.5 rounded-lg px-2.5 py-2 outline-none data-[highlighted]:bg-hover"
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] text-xs font-extrabold text-white"
                style={{ background: p.color }}
              >
                {p.key[0]}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-ink">{p.name}</div>
                <div className="text-xs text-muted">
                  {p.template} · {p.key}
                </div>
              </div>
              {p.id === current.id && <Check size={16} className="shrink-0 text-primary" />}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}