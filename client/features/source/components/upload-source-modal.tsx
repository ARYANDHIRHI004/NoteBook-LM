"use client";

import { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  FolderOpen,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUploadPdf, type Source } from "../index";
import type { Workspace } from "@/features/workspace";

export interface UploadSourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId?: string;
  workspaces?: Workspace[];
  onSuccess?: (source: Source) => void;
}

function formatFileSize(bytes?: number) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function UploadSourceModal({
  open,
  onOpenChange,
  workspaceId: initialWorkspaceId,
  workspaces = [],
  onSuccess,
}: UploadSourceModalProps) {
  const uploadPdfMutation = useUploadPdf();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>(
    initialWorkspaceId || (workspaces[0]?.id ? String(workspaces[0].id) : "")
  );

  const effectiveWorkspaceId = initialWorkspaceId || selectedWorkspaceId;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const resetForm = () => {
    setSelectedFile(null);
    setTitle("");
    setError(null);
    setUploadSuccess(false);
  };

  const handleClose = () => {
    if (!uploadPdfMutation.isPending) {
      resetForm();
      onOpenChange(false);
    }
  };

  const validateAndSetFile = (file: File | null) => {
    setError(null);
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files are supported at this time.");
      return;
    }

    const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE_BYTES) {
      setError("File size exceeds the 10MB limit.");
      return;
    }

    setSelectedFile(file);
    if (!title.trim()) {
      setTitle(file.name.replace(/\.pdf$/i, ""));
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a PDF file to upload.");
      return;
    }

    if (!effectiveWorkspaceId) {
      setError("Please select or create a workspace first.");
      return;
    }

    setError(null);

    try {
      const source = await uploadPdfMutation.mutateAsync({
        workspaceId: effectiveWorkspaceId,
        file: selectedFile,
        title: title.trim() || undefined,
      });

      setUploadSuccess(true);
      if (onSuccess) {
        onSuccess(source);
      }

      setTimeout(() => {
        handleClose();
      }, 900);
    } catch (err: any) {
      setError(
        err?.message || "Failed to upload PDF file. Please try again."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-primary" />
            Upload PDF Source
          </DialogTitle>
          <DialogDescription>
            Add a research paper, notes, or document (PDF up to 10MB) to your
            workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Target Workspace Selection (if modal is opened without a fixed workspaceId) */}
          {!initialWorkspaceId && workspaces.length > 0 && (
            <div className="space-y-1.5">
              <label htmlFor="target-workspace" className="text-sm font-medium">
                Target Workspace
              </label>
              <div className="relative">
                <select
                  id="target-workspace"
                  value={effectiveWorkspaceId}
                  onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={uploadPdfMutation.isPending}
                >
                  {workspaces.map((ws) => (
                    <option key={ws.id} value={ws.id}>
                      {(ws.icon ? ws.icon + " " : "") +
                        (ws.title || ws.name || "Untitled Workspace")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Status Banners */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {uploadSuccess && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>PDF uploaded and queued for processing!</span>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                validateAndSetFile(e.target.files[0]);
              }
            }}
          />

          {/* Drag & Drop Zone */}
          {!selectedFile ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all",
                dragActive
                  ? "border-primary bg-primary/10 scale-[0.99]"
                  : "border-border hover:border-primary/50 hover:bg-muted/40"
              )}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UploadCloud className="h-6 w-6" />
              </div>
              <p className="mt-3 text-sm font-medium">
                Click to browse or drag and drop your PDF
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Supported formats: PDF documents (up to 10 MB)
              </p>
            </div>
          ) : (
            /* Selected File Card */
            <div className="flex items-center justify-between rounded-xl border bg-muted/40 p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setSelectedFile(null);
                  setTitle("");
                  setError(null);
                }}
                disabled={uploadPdfMutation.isPending}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Custom Title Input */}
          {selectedFile && (
            <div className="space-y-1.5">
              <label htmlFor="source-title" className="text-sm font-medium">
                Source Title{" "}
                <span className="text-xs text-muted-foreground">
                  (optional)
                </span>
              </label>
              <Input
                id="source-title"
                placeholder="e.g. Attention Is All You Need"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploadPdfMutation.isPending}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={uploadPdfMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploadPdfMutation.isPending}
            className="gap-2"
          >
            {uploadPdfMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <span>Upload PDF</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
