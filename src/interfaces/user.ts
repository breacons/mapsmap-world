export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  boardIds: Record<string, boolean>;
  followedProjects?: Record<string, boolean>;
  avatar: string | null;
}
