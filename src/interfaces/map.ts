export interface Board {
  id: string;
  researchAreas: ResearchArea[];
  technologies: Technology[];
  topics: Topic[];
  levels: Level[];
  title: string;
  memberIds: Record<string, boolean>;
  adminIds: Record<string, boolean>;
  ownerId: string;
}

export interface ResearchArea {
  id: string;
  title: string;
  order: number;
}

export interface Technology {
  id: string;
  title: string;
  order: number;
  areaId: string;
}

export interface Topic {
  id: string;
  title: string;
  order: number;
  boardId: string;
  technologyId: string;
  levelId: string;
  dependentOn?: Record<string, { id: string }>;
  requiredBy?: Record<string, { id: string }>;
  mainVersionId: string;
  versions?: Record<string, TopicVersion>;
}

export interface Level {
  id: string;
  title: string;
  order: number;
}

export interface TopicVersion {
  id: string;
  content?: string | null;
  mainVersion: boolean;
  milestones?: Record<string, Milestone>;
  targets?: Record<string, Target>;
  projects?: Record<string, Project>;
  editors?: Record<string, Participant>;
  comments?: Record<string, Comment> | undefined;
}

export interface Project {
  id: string;
  title: string;
  organisation: string;
  content: string;
  requiredFunding: number;
  raisedFunding: number;
  backings?: Record<string, Backing>;
  participants: Record<string, Participant>;
  coverImageUrl?: string;
  comments?: Record<string, Comment> | undefined;
}

export interface Backing {
  id: string;
  userId: string;
  amount: number;
  userName: string;
  time: number;
}

export interface Participant {
  id: string;
}

export interface Target {
  id: string;
  description: string;
  completed: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  status: string; // TODO: enum
  deadline: number;
}

export type Id = string;

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  upvotes?: string[]; // TODO: firebase collection
  downvotes?: string[]; // TODO: firebase collection
  replies: Record<string, Comment>;
  time: number;
  lastUpdated: number;
}
