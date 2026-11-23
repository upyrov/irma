import type { Assignee } from "#/components/ProjectTemplate/Scrum/backlog/types"

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

export const assignableRoles: ProjectRole[] = ["admin", "member", "viewer"]

export const allRoles: ProjectRole[] = ["owner", "admin", "member", "viewer"]
