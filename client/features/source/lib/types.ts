export type SourceType =
  | "pdf"
  | "website"
  | "youtube"
  | "text"
  | "markdown"
  | "web"
  | "audio"
  | "video";

export type SourceStatus = "pending" | "processing" | "ready" | "failed";

export interface SourceMetadata {
  pageCount?: number;
  fileName?: string;
  fileSize?: number;
  fileUrl?: string;
  [key: string]: any;
}

export interface Source {
  id: string | number;
  workspaceId: string;
  type: SourceType;
  title: string;
  name?: string;
  content?: string | null;
  url?: string | null;
  status?: SourceStatus;
  metadata?: SourceMetadata | null;
  meta?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UploadPdfInput {
  workspaceId: string;
  file: File;
  title?: string;
}
