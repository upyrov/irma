import { cn } from "cn"
import type { ReactNode } from "react"
import { ProjectSwitcher } from "./componennts/dropdown"
import { Logo } from "./componennts/logo"
import { Navigation } from "./componennts/navigation"
import { UserMenu } from "./componennts/userMenu"

/**
 * Оболонка сайдбару: завжди на всю висоту екрана, прилипає при прокрутці
 * сторінки, а якщо вміст не влазить — прокручується сама.
 */
export function SidebarShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <aside
      className={cn(
        "sticky top-0 box-border flex h-dvh w-60 shrink-0 flex-col gap-5 self-start overflow-y-auto border-r border-border bg-white px-3.5 pt-5 pb-1",
        className
      )}
    >
      {children}
    </aside>
  )
}

export function Sidebar() {
  return (
    <SidebarShell>
      <Logo />
      <ProjectSwitcher />
      <Navigation />
      <UserMenu />
    </SidebarShell>
  )
}
