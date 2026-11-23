import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { type FormEvent, useState } from 'react'
import { errorMessage, useRegister } from '#/api/hooks/useAuth'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const register = useRegister()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    register.mutate(
      { username: username.trim(), password },
      // Бекенд одразу логінить після реєстрації
      { onSuccess: () => navigate({ to: '/', replace: true }) }
    )
  }

  const error = errorMessage(register.error)

    return (
    <div className="flex min-h-screen flex-wrap bg-page font-['Inter',system-ui,sans-serif] text-ink">
      <div className="box-border flex flex-[1_1_520px] flex-col justify-between gap-12 bg-ink px-14 py-12 text-white">
        <div className="flex items-center gap-2.5">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" aria-hidden="true">
            <rect x="2.5" y="2.5" width="19" height="19" rx="6" className="fill-primary" stroke="none" />
            <ellipse cx="12" cy="12" rx="6.5" ry="3" transform="rotate(-30 12 12)" />
            <circle cx="12" cy="12" r="1.6" fill="#FFFFFF" stroke="none" />
          </svg>
          <span className="font-['Manrope',sans-serif] text-[22px] font-extrabold tracking-[-0.02em]">Orbit</span>
        </div>

        <div className="max-w-[480px] my-auto">
          <h1 className="mb-4 font-['Manrope',sans-serif] text-[44px] font-extrabold leading-[1.1] tracking-[-0.03em]">
            Створіть акаунт і зберіть команду
          </h1>
            <div className="flex flex-col gap-3.5">
            <div className="flex items-center gap-3 mt-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2C3038] text-[13px] font-bold">1</span>
                <p className="text-base text-[#D5D9E0]">Зареєструйтесь</p>
            </div>
            <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2C3038] text-[13px] font-bold">2</span>
                <p className="text-base text-[#D5D9E0]">Створіть команду та проєкт за шаблоном</p>
            </div>
            <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2C3038] text-[13px] font-bold">3</span>
                <p className="text-base text-[#D5D9E0]">Запросіть учасників і роздайте ролі</p>
            </div>
            </div>
        </div>
      </div>

      {/* Права панель з формою */}
      <div className="box-border flex flex-[1_1_520px] items-center justify-center px-6 py-12">
        <form onSubmit={handleSubmit} className="flex w-full max-w-[400px] flex-col gap-5">
          <div>
            <h2 className="mb-2 font-['Manrope',sans-serif] text-[30px] font-extrabold tracking-[-0.02em]">Реєстрація</h2>
            <p className="text-[15px] text-muted">Це займе менше хвилини.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-username" className="text-sm font-semibold">
              Ім'я користувача
            </label>
            <input
              id="register-username"
              type="text"
              placeholder="john.pork"
              autoComplete="username"
              required
              minLength={3}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11 rounded-[10px] border border-border-input bg-white px-3.5 text-[15px] text-ink outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-pass" className="text-sm font-semibold">
              Пароль <span className="font-normal text-muted">— щонайменше 8 символів</span>
            </label>
            <input
              id="register-pass"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              required
              minLength={8}
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
            disabled={register.isPending}
            className="h-[46px] cursor-pointer rounded-[10px] bg-primary text-[15px] font-semibold text-white hover:bg-primary-hover disabled:cursor-wait disabled:opacity-60"
          >
            {register.isPending ? 'Створюємо акаунт…' : 'Зареєструватися'}
          </button>

          <p className="text-center text-sm text-muted">
            Вже є акаунт?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-hover">
              Увійти
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
