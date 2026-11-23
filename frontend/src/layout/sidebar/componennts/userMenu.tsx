import { useNavigate } from "@tanstack/react-router"
import { useLogout } from "#/api/hooks/useAuth"
import { User } from "./user"

export const UserMenu = () => {
  const navigate = useNavigate()
  const logout = useLogout()

  return (
    <div className="mt-auto flex items-center gap-2.5 border-t border-border p-2.5">
      <User />
      <button
        type="button"
        aria-label="Вийти"
        title="Вийти"
        disabled={logout.isPending}
        onClick={() =>
          logout.mutate(undefined, {
            // Навіть якщо запит упав, локально вже вийшли — ведемо на логін
            onSettled: () => navigate({ to: "/login", replace: true }),
          })
        }
        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted hover:bg-hover hover:text-ink disabled:opacity-50"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4M6 12h10" />
        </svg>
      </button>
    </div>
  )
}
