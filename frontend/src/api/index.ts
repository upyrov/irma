// Сирі функції API — для beforeLoad / loader і там, де хуки не підходять
export { authApi } from "./auth"
export { ApiError, USE_MOCKS } from "./client"
export { issuesApi } from "./issues"
export { projectsApi } from "./projects"
export { sprintsApi } from "./sprints"
export { teamsApi } from "./teams"

// Хуки TanStack Query — для компонентів
export * from "./hooks/useAuth"
export * from "./hooks/useIssues"
export * from "./hooks/useProjects"
export * from "./hooks/useSprints"
export * from "./hooks/useTeams"
export { queryKeys } from "./queryKeys"
