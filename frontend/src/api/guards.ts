import type { QueryClient } from "@tanstack/react-query"
import { redirect } from "@tanstack/react-router"
import { meQueryOptions } from "./hooks/useAuth"

/**
 * `beforeLoad` для сторінок, куди можна лише після входу.
 * Неавторизованого користувача веде на /login і запамʼятовує, куди він ішов.
 */
export const requireAuth = async ({
  context,
  location,
}: {
  context: { queryClient: QueryClient }
  location: { href: string }
}) => {
  const user = await context.queryClient.ensureQueryData(meQueryOptions)
  if (!user) {
    throw redirect({ to: "/login", search: { redirect: location.href } })
  }
  return { user }
}

/** Безпечна адреса для повернення після входу: лише внутрішні шляхи */
export const safeRedirect = (value: unknown) =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/"
