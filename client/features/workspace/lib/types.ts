export interface Workspace {
  id: string;
  userId?: string;
  title: string;
  name?: string;
  description?: string | null;
  icon?: string | null;
  defaultModel?: string | null;
  createdAt: string;
  updatedAt: string;
  sourcesCount?: number;
  sources?: number;
}

export interface CreateWorkspaceInput {
  title?: string;
  name?: string;
  description?: string;
  icon?: string;
  defaultModel?: string;
}

export interface UpdateWorkspaceInput {
  title?: string;
  name?: string;
  description?: string;
  icon?: string;
  defaultModel?: string;
}
