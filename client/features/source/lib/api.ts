import { axiosInstance } from "@/lib/axios";
import { ApiError } from "@/shared/lib/api";
import type { Source, UploadPdfInput } from "./types";

function normalizeSource(data: any): Source {
  if (!data) return data;
  const pageCount = data.metadata?.pageCount;
  const meta =
    data.meta ||
    (data.type === "pdf"
      ? pageCount
        ? `PDF · ${pageCount} pages`
        : "PDF"
      : "Document");

  return {
    ...data,
    id: String(data.id),
    name: data.title || data.name || "Untitled Source",
    title: data.title || data.name || "Untitled Source",
    meta,
  };
}

export async function uploadPdf(input: UploadPdfInput): Promise<Source> {
  try {
    const formData = new FormData();
    formData.append("file", input.file);
    formData.append("workspaceId", input.workspaceId);
    if (input.title) {
      formData.append("title", input.title);
    }

    const response = await axiosInstance.post(
      `/api/v1/source/upload/${input.workspaceId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return normalizeSource(response.data);
  } catch (error) {
    throw ApiError.fromError(error);
  }
}

export async function listSources(workspaceId: string): Promise<Source[]> {
  try {
    const response = await axiosInstance.get(`/api/v1/source/${workspaceId}`);
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(normalizeSource);
  } catch (error) {
    throw ApiError.fromError(error);
  }
}

export async function deleteSource(
  workspaceId: string,
  sourceId: string
): Promise<void> {
  try {
    await axiosInstance.delete(`/api/v1/source/${workspaceId}/${sourceId}`);
  } catch (error) {
    throw ApiError.fromError(error);
  }
}
