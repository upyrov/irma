export type Guid = string;

export type ProjectRole = 'Owner' | 'Admin' | 'Member' | 'Viewer';
export type ProjectTemplate = 'Scrum' | 'Kanban' | 'BugTracking';
export type SprintStatus = 'Planned' | 'Active' | 'Closed';
export type IssueType = 'Epic' | 'Story' | 'Task' | 'Bug';
export type Priority = 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest';

export type UserDto = {
  id: Guid;
  username: string;
};

export type TeamDto = {
  id: Guid;
  name: string;
  members: UserDto[];
};

// У ТЗ не розписано, що лежить у ProjectDto.Members — найлогічніше юзер + роль
export type ProjectMemberDto = {
  user: UserDto;
  role: ProjectRole;
};

export type ProjectDto = {
  id: Guid;
  name: string;
  description: string;
  template: ProjectTemplate;
  teamId: Guid;
  members: ProjectMemberDto[];
};

export type SprintDto = {
  id: Guid;
  name: string;
  goal: string | null;
  startDate: string | null; // DateTimeOffset приходить як ISO-рядок
  endDate: string | null;
  status: SprintStatus;
  projectId: Guid;
};

export type StageDto = {
  id: Guid;
  name: string;
  order: number;
  projectId: Guid;
};

export type IssueDto = {
  id: Guid;
  issueKey: string;
  title: string;
  description: string;
  issueType: IssueType;
  priority: Priority;
  storyPoints: number | null;
  assignee: UserDto | null;
  stageId: Guid;
  sprintId: Guid | null;
  epicId: Guid | null;
  createdAt: string;
};

export type CommentDto = {
  id: Guid;
  text: string;
  author: UserDto;
  createdAt: string;
  issueId: Guid;
};