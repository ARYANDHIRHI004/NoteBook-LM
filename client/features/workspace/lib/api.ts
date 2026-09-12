import { axiosInstance } from "@/lib/axios";
import { ApiError } from "@/shared/lib/api";
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  Workspace,
} from "./types";

function normalizeWorkspace(data: any): Workspace {
  if (!data) return data;
  return {
    ...data,
    id: String(data.id),
    title: data.title || data.name || "Untitled Workspace",
    name: data.title || data.name || "Untitled Workspace",
    sources: data.sources ?? data.sourcesCount ?? 0,
    sourcesCount: data.sourcesCount ?? data.sources ?? 0,
  };
}

export async function listWorkspaces(): Promise<Workspace[]> {
  try {
    const response = await axiosInstance.get<any[]>(
      "/api/v1/workspace/get-all-workspaces-by-userId"
    );
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(normalizeWorkspace);
  } catch (error) {
    throw ApiError.fromError(error);
  }
}

export async function getWorkspace(id: string): Promise<Workspace> {
  try {
    const response = await axiosInstance.get(
      `/api/v1/workspace/get-workspace-by-id/${id}`
    );
    return normalizeWorkspace(response.data);
  } catch (error) {
    throw ApiError.fromError(error);
  }
}

export async function createWorkspace(
  input: CreateWorkspaceInput
): Promise<Workspace> {
  try {
    const payload = {
      title: input.title || input.name || "Untitled Workspace",
      description: input.description,
      icon: input.icon,
      defaultModel: input.defaultModel,
    };
    const response = await axiosInstance.post(
      "/api/v1/workspace/create-workspace",
      payload
    );
    return normalizeWorkspace(response.data);
  } catch (error) {
    throw ApiError.fromError(error);
  }
}

export async function updateWorkspace(
  id: string,
  input: UpdateWorkspaceInput
): Promise<Workspace> {
  try {
    const payload = {
      title: input.title || input.name,
      name: input.title || input.name,
      description: input.description,
      icon: input.icon,
      defaultModel: input.defaultModel,
    };

    try {
      const response = await axiosInstance.put(
        `/api/v1/workspace/update-workspace-by-id/${id}`,
        payload
      );
      return normalizeWorkspace(response.data);
    } catch (putError: any) {
      // Fallback to GET if PUT is blocked
      if (putError?.response?.status === 405 || putError?.response?.status === 404) {
        const response = await axiosInstance.get(
          `/api/v1/workspace/update-workspace-by-id/${id}`,
          { params: payload }
        );
        return normalizeWorkspace(response.data);
      }
      throw putError;
    }
  } catch (error) {
    throw ApiError.fromError(error);
  }
}

export async function deleteWorkspace(
  id: string
): Promise<{ success: boolean; id: string }> {
  try {
    try {
      const response = await axiosInstance.delete(
        `/api/v1/workspace/delete-workspace-by-id/${id}`
      );
      return { success: true, id, ...response.data };
    } catch (delError: any) {
      // Fallback to GET if DELETE method is blocked
      if (delError?.response?.status === 405) {
        const response = await axiosInstance.get(
          `/api/v1/workspace/delete-workspace-by-id/${id}`
        );
        return { success: true, id, ...response.data };
      }
      throw delError;
    }
  } catch (error) {
    throw ApiError.fromError(error);
  }
}
