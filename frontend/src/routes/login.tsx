import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { LogoMark } from '#/layout/sidebar/componennts/logo'
import { type FormEvent, useState } from 'react'
import { safeRedirect } from '#/api/guards'
import { ApiError } from '#/api/client'
import { errorMessage, useLogin } from '#/api/hooks/useAuth'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: RouteComponent,
})

function RouteComponent() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { redirect } = Route.useSearch()
    const navigate = useNavigate()
    const login = useLogin()

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        login.mutate(
          { username: username.trim(), password },
          { onSuccess: () => navigate({ href: safeRedirect(redirect), replace: true }) }
        )
    }

    const error =
      login.error instanceof ApiError && login.error.status === 401
        ? 'Неправильний логін або пароль'
        : errorMessage(login.error)

return (
    <div className="flex min-h-screen flex-wrap bg-page font-['Inter',system-ui,sans-serif] text-ink">
      <div className="box-border flex flex-[1_1_520px] flex-col justify-between gap-12 bg-ink px-14 py-12 text-white">
        <div className="flex items-center gap-2.5">
          <LogoMark size={30} />
          <span className="font-['Manrope',sans-serif] text-[22px] font-extrabold tracking-[-0.02em]">Irma</span>
        </div>

        <div className="max-w-[480px]">
          <h1 className="mb-4 font-['Manrope',sans-serif] text-[44px] font-extrabold leading-[1.1] tracking-[-0.03em]">
            Плануйте спринти. Рухайте задачі. Без зайвого.
          </h1>
          <p className="text-[17px] leading-[1.6] text-[#B9BFCB]">
            Scrum і Kanban дошки, беклог, епіки та ролі в команді — в одному робочому просторі.
          </p>
        </div>

        <div aria-hidden="true" className="grid max-w-[520px] grid-cols-3 gap-3">
          <div className="flex flex-col gap-2 rounded-xl bg-[#22252C] p-3">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-[#8C93A1]">TO DO</div>
            <div className="h-11 rounded-lg bg-[#2C3038]" />
            <div className="h-[30px] rounded-lg bg-[#2C3038]" />
          </div>
          <div className="flex flex-col gap-2 rounded-xl bg-[#22252C] p-3">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-[#8C93A1]">IN PROGRESS</div>
            <div className="h-[52px] -rotate-3 rounded-lg bg-primary" />
            <div className="h-[30px] rounded-lg bg-[#2C3038]" />
          </div>
          <div className="flex flex-col gap-2 rounded-xl bg-[#22252C] p-3">
            <div className="text-[11px] font-semibold tracking-[0.06em] text-[#8C93A1]">DONE</div>
            <div className="h-[30px] rounded-lg bg-[#2C3038]" />
          </div>
        </div>
      </div>

      <div className="box-border flex flex-[1_1_520px] items-center justify-center px-6 py-12">
        <form onSubmit={handleSubmit} className="flex w-full max-w-[400px] flex-col gap-5">
          <div>
            <h2 className="mb-2 font-['Manrope',sans-serif] text-[30px] font-extrabold tracking-[-0.02em]">Вхід</h2>
            <p className="text-[15px] text-muted">Раді бачити знову. Увійдіть, щоб продовжити.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-username" className="text-sm font-semibold">
              Ім'я користувача
            </label>
            <input
              id="login-username"
              type="text"
              placeholder="JohnPork"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11 rounded-[10px] border border-border-input bg-white px-3.5 text-[15px] text-ink outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-pass" className="text-sm font-semibold">
              Пароль
            </label>
            <input
              id="login-pass"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-[10px] border border-border-input bg-white px-3.5 text-[15px] text-ink outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
            />
          </div>

          {error && (
            <div role="alert" className="flex items-center gap-2 rounded-[10px] bg-danger-bg px-3 py-2.5 text-sm text-danger-text">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5M12 16.5v.01" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={login.isPending}
            className="h-[46px] cursor-pointer rounded-[10px] bg-primary text-[15px] font-semibold text-white hover:bg-primary-hover disabled:cursor-wait disabled:opacity-60"
          >
            {login.isPending ? 'Входимо…' : 'Увійти'}
          </button>

          <p className="text-center text-sm text-muted">
            Ще немає акаунта?{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-primary-hover">
              Зареєструватися
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
