import { Link } from "@tanstack/react-router"
import { PageSpinner } from "#/components/ui/spinner"
import type { ReactNode } from "react"
import { Badge } from "#/components/ui/badge"
import type { Project } from "#/api/adapters"
import { errorMessage } from "#/api/hooks/useAuth"
import { useUiProjects } from "#/api/hooks/useProjectView"
import { firstSection, sectionPath } from "#/lib/projectTemplates"

const cardClass =
  "flex flex-col gap-4 rounded-[14px] border border-border bg-white p-5 text-ink no-underline"

const ProjectCard = ({ project, children }: { project: Project; children: ReactNode }) => {
  const section = firstSection(project.template)
  if (!section) {
    return (
      <div aria-disabled="true" title="Шаблон ще в розробці" className={`${cardClass} cursor-not-allowed opacity-60`}>
        {children}
      </div>
    )
  }
  return (
    <Link
      to={sectionPath[section]}
      params={{ projectId: project.id }}
      className={`${cardClass} hover:border-primary hover:shadow-[0_6px_20px_rgba(22,24,29,0.08)]`}
    >
      {children}
    </Link>
  )
}

type Props = { onCreate?: () => void }

export const ProjectList = ({ onCreate }: Props) => {
    const { data: projects, isPending, error } = useUiProjects()

    if (isPending) return <PageSpinner label="Завантаження проєктів" />
    if (error) return <p className="text-sm text-danger-text">{errorMessage(error)}</p>

    return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
              {projects?.length === 0 && (
                <p className="col-span-full text-sm text-muted">
                  Поки що немає проєктів. Створіть команду на сторінці «Команди», а потім — проєкт.
                </p>
              )}
              {(projects ?? []).map((p) => (
                <ProjectCard key={p.id} project={p}>
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] font-['Manrope',sans-serif] text-[15px] font-extrabold text-white"
                      style={{ background: p.color }}
                    >
                      {p.key[0]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-base font-bold">{p.name}</div>
                      <div className="font-['JetBrains_Mono',monospace] text-xs text-muted">
                        {p.key}{p.team && ` · ${p.team}`}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        p.template === 'Scrum'
                          ? 'bg-primary-tint text-primary-hover'
                          : p.template === 'Kanban'
                            ? 'bg-success-bg text-success-text'
                            : 'bg-danger-bg text-danger-text'
                      }`}
                    >
                      {p.template}
                    </span>
                  </div>
        
                  <p className="min-h-[42px] text-sm leading-normal text-text-2">{p.description}</p>
        
                  <div className="flex items-center justify-between border-t border-hover pt-3.5">
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
                    {firstSection(p.template) ? (
                      <span className="text-[13px] text-muted">{p.stat}</span>
                    ) : (
                      <Badge variant="yellow" size="chip" className="font-bold">
                        НЕЗАБАРОМ
                      </Badge>
                    )}
                  </div>
                </ProjectCard>
              ))}
        
              <button
                type="button"
                onClick={onCreate}
                className="flex min-h-[196px] flex-col items-center justify-center gap-2.5 rounded-[14px] border-[1.5px] border-dashed border-[#C3C8D1] text-[15px] font-semibold text-text-2 hover:border-primary"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-tint text-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
                Новий проєкт
              </button>
        
        
            </div>
    )
}