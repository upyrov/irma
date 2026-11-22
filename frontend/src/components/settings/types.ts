import type { Assignee } from "#/components/backlog/types"

export type ProjectRole = "owner" | "admin" | "member" | "viewer"

export type ProjectMember = Assignee & {
  username: string
  role: ProjectRole
}

export const roleLabels: Record<ProjectRole, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
  viewer: "Viewer",
}

/** Ролі, які можна призначити (Owner — лише один, призначається при створенні) */
export const assignableRoles: ProjectRole[] = ["admin", "member", "viewer"]

export const allRoles: ProjectRole[] = ["owner", "admin", "member", "viewer"]
