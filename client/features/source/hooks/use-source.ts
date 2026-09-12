"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { uploadPdf, listSources, deleteSource } from "../lib/api";
import type { Source, UploadPdfInput } from "../lib/types";
import { workspaceKeys } from "@/features/workspace/hooks/use-workspace";

export const sourceKeys = {
  all: ["sources"] as const,
  byWorkspace: (workspaceId: string) => ["sources", workspaceId] as const,
};

export function useUploadPdf() {
  const queryClient = useQueryClient();

  return useMutation<Source, Error, UploadPdfInput>({
    mutationFn: (input: UploadPdfInput) => uploadPdf(input),
    onSuccess: (newSource, variables) => {
      // Invalidate workspace detail so source counts update
      void queryClient.invalidateQueries({
        queryKey: workspaceKeys.detail(variables.workspaceId),
      });
      void queryClient.invalidateQueries({
        queryKey: workspaceKeys.all,
      });
      void queryClient.invalidateQueries({
        queryKey: sourceKeys.byWorkspace(variables.workspaceId),
      });
    },
  });
}

export function useListSources(workspaceId: string) {
  return useQuery<Source[], Error>({
    queryKey: sourceKeys.byWorkspace(workspaceId),
    queryFn: () => listSources(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useDeleteSource(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (sourceId: string) => deleteSource(workspaceId, sourceId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: sourceKeys.byWorkspace(workspaceId),
      });
      void queryClient.invalidateQueries({
        queryKey: workspaceKeys.all,
      });
    },
  });
}
