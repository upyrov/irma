import type { Guid } from "#/types/api"

/**
 * Ключі кешу TanStack Query.
 * Усе, що належить проєкту, лежить під ["projects", id] — щоб після змін
 * (старт спринту, нова задача) можна було одним рядком оновити всі його дані.
 */
export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  teams: {
    list: ["teams", "list"] as const,
    searchUsers: (search: string) => ["teams", "search-users", search] as const,
  },
  projects: {
    list: ["projects", "list"] as const,
    /** Префікс для всіх даних конкретного проєкту */
    scope: (projectId: Guid) => ["projects", projectId] as const,
    members: (projectId: Guid) => ["projects", projectId, "members"] as const,
    epics: (projectId: Guid) => ["projects", projectId, "epics"] as const,
    myRole: (projectId: Guid) => ["projects", projectId, "my-role"] as const,
    sprints: (projectId: Guid) => ["projects", projectId, "sprints"] as const,
    backlog: (projectId: Guid) => ["projects", projectId, "backlog"] as const,
    stages: (projectId: Guid) => ["projects", projectId, "stages"] as const,
    board: (projectId: Guid) => ["projects", projectId, "board"] as const,
  },
  issues: {
    detail: (issueId: Guid) => ["issues", issueId] as const,
    comments: (issueId: Guid) => ["issues", issueId, "comments"] as const,
  },
}
