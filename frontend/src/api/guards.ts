import type { QueryClient } from "@tanstack/react-query"
import { redirect } from "@tanstack/react-router"
import { meQueryOptions } from "./hooks/useAuth"

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

export const safeRedirect = (value: unknown) =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/"
