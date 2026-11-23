export type Guid = string
export type DateTimeOffset = string

export type ProjectRole = "Owner" | "Admin" | "Member" | "Viewer"
export type ProjectTemplate = "Scrum" | "Kanban" | "BugTracking"

export type UserDto = {
  id: Guid
  username: string
}

export type UserLoginDto = {
  username: string
  password: string
}

export type UserRegisterDto = {
  username: string
  password: string
}

export type TeamDto = {
  id: Guid
  name: string
  members: UserDto[]
}

export type TeamCreateDto = {
  name: string
}

export type ProjectCreateDto = {
  name: string
  description: string | null
  teamId: Guid
  template: ProjectTemplate
}

export type ProjectDto = {
  id: Guid
  name: string
  description: string | null
  template: ProjectTemplate
  teamId: Guid
  members: ProjectMemberDto[]
}

export type ProjectMemberDto = {
  userId: Guid
  username: string
  role: ProjectRole
}

export type AddProjectMemberDto = {
  userId: Guid
  role: ProjectRole
}

export type SprintStatus = "Planned" | "Active" | "Closed"

export type SprintCreateDto = {
  name: string
  goal: string | null
  startDate: DateTimeOffset | null
  endDate: DateTimeOffset | null
  projectId: Guid
}

export type SprintDto = {
  id: Guid
  name: string
  goal: string | null
  startDate: DateTimeOffset | null
  endDate: DateTimeOffset | null
  status: SprintStatus
  projectId: Guid
}

export type StageDto = {
  id: Guid
  name: string
  order: number
  projectId: Guid
}

export type IssueType = "Epic" | "Story" | "Task" | "Bug"
export type Priority = "Highest" | "High" | "Medium" | "Low" | "Lowest"

export type IssueCreateDto = {
  title: string
  description: string | null
  issueType: IssueType
  priority: Priority
  storyPoints: number | null
  assigneeId: Guid | null
  stageId: Guid
  sprintId: Guid | null
  epicId: Guid | null
}

export type IssueUpdateDto = Partial<{
  title: string
  description: string | null
  priority: Priority
  storyPoints: number | null
  assigneeId: Guid | null
  stageId: Guid
  sprintId: Guid | null
  epicId: Guid | null
}>

export type IssueDto = {
  id: Guid
  issueKey: string
  title: string
  description: string | null
  issueType: IssueType
  priority: Priority
  storyPoints: number | null
  assignee: UserDto | null
  stageId: Guid
  sprintId: Guid | null
  epicId: Guid | null
  createdAt: DateTimeOffset
}

export type BoardIssueDto = {
  id: Guid
  issueKey: string
  title: string
  issueType: IssueType
  priority: Priority
  storyPoints: number | null
  stageId: Guid
  sprintId: Guid | null
  epicId: Guid | null
  assignee: UserDto | null
  createdAt: DateTimeOffset
}

export type CommentCreateDto = {
  text: string
}

export type CommentDto = {
  id: Guid
  text: string
  author: UserDto
  createdAt: DateTimeOffset
  issueId: Guid
}

export type ProblemDetails = {
  type?: string
  title?: string
  status?: number
  detail?: string
  errors?: Record<string, string[]>
}

export type MyRoleDto = { role: ProjectRole | null }
