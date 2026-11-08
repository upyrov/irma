import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
  
  const handleSubmit = () => {
    setError('')
  }
    return (
    <div className="flex min-h-screen flex-wrap bg-[#F4F5F7] font-['Inter',system-ui,sans-serif] text-[#16181D]">
      <div className="box-border flex flex-[1_1_520px] flex-col justify-between gap-12 bg-[#16181D] px-14 py-12 text-white">
        <div className="flex items-center gap-2.5">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" aria-hidden="true">
            <rect x="2.5" y="2.5" width="19" height="19" rx="6" fill="#2F5BEA" stroke="none" />
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
            <p className="text-[15px] text-[#5B6270]">Це займе менше хвилини.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-user" className="text-sm font-semibold">
              Ім'я
            </label>
            <input
              id="login-user"
              type="text"
              placeholder="John"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11 rounded-[10px] border border-[#D3D7DE] bg-white px-3.5 text-[15px] text-[#16181D] outline-none focus:border-[#2F5BEA] focus:ring-[3px] focus:ring-[#2F5BEA]/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className="text-sm font-semibold">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              placeholder="johnpork@gmail.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-[10px] border border-[#D3D7DE] bg-white px-3.5 text-[15px] text-[#16181D] outline-none focus:border-[#2F5BEA] focus:ring-[3px] focus:ring-[#2F5BEA]/20"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-[10px] border border-[#D3D7DE] bg-white px-3.5 text-[15px] text-[#16181D] outline-none focus:border-[#2F5BEA] focus:ring-[3px] focus:ring-[#2F5BEA]/20"
            />
          </div>

          {error && (
            <div role="alert" className="flex items-center gap-2 rounded-[10px] bg-[#FDECEC] px-3 py-2.5 text-sm text-[#9B1C1C]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5M12 16.5v.01" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="h-[46px] rounded-[10px] bg-[#2F5BEA] text-[15px] font-semibold text-white hover:bg-[#1E40B8]"
          >
            Увійти
          </button>

          <p className="text-center text-sm text-[#5B6270]">
            Вже є акаунт?{' '}
            <Link to="/login" className="font-semibold text-[#2F5BEA] hover:text-[#1E40B8]">
              Увійти
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
