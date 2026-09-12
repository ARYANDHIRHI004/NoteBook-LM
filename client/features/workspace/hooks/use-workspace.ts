"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/shared/lib/api";
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspace,
  listWorkspaces,
  updateWorkspace,
} from "../lib/api";
import type {
  CreateWorkspaceInput,
  UpdateWorkspaceInput,
  Workspace,
} from "../lib/types";

export const workspaceKeys = {
  all: ["workspaces"] as const,
  detail: (id: string) => ["workspaces", id] as const,
};

export function useWorkspaces() {
  return useQuery<Workspace[], ApiError>({
    queryKey: workspaceKeys.all,
    queryFn: listWorkspaces,
  });
}

export function useWorkspace(id: string) {
  return useQuery<Workspace, ApiError>({
    queryKey: workspaceKeys.detail(id),
    queryFn: () => getWorkspace(id),
    enabled: Boolean(id),
    retry: (_, error) =>
      !(error instanceof ApiError && error.status === 404),
  });
}

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateWorkspaceInput) => createWorkspace(input),
    onSuccess: (newWorkspace) => {
      queryClient.setQueryData(workspaceKeys.detail(newWorkspace.id), newWorkspace);
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}

export function useUpdateWorkspace(workspaceId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      args: UpdateWorkspaceInput | { id: string; input: UpdateWorkspaceInput }
    ) => {
      if (workspaceId) {
        return updateWorkspace(workspaceId, args as UpdateWorkspaceInput);
      }
      const { id, input } = args as { id: string; input: UpdateWorkspaceInput };
      return updateWorkspace(id, input);
    },
    onSuccess: (workspace, variables) => {
      const id = workspaceId ?? (variables as any)?.id ?? workspace.id;
      if (id) {
        queryClient.setQueryData(workspaceKeys.detail(id), workspace);
      }
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteWorkspace(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: workspaceKeys.detail(id) });
      void queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}