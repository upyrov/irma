import { requireAuth } from '#/api/guards'
import { Sidebar } from '#/layout/sidebar/sidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  // Сесія — у HttpOnly cookie браузера, тож перевіряємо її в браузері, а не під час SSR
  ssr: false,
  beforeLoad: requireAuth,
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="flex min-h-screen bg-page">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  )
}
