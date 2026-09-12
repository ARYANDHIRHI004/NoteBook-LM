"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  FolderOpen,
  FileText,
  MoreHorizontal,
  Clock3,
  ArrowRight,
  NotebookPen,
  LayoutGrid,
  Settings,
  LogOut,
  Loader2,
  Trash2,
  ExternalLink,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSession, signOut } from "@/features/auth/lib/auth-client";
import {
  useWorkspaces,
  useCreateWorkspace,
  useDeleteWorkspace,
  type Workspace,
} from "@/features/workspace";

function formatWorkspaceDate(dateValue?: string | Date) {
  if (!dateValue) return "Recently";
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return "Recently";
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return "Recently";
  }
}

const WORKSPACE_ICONS = [
  "📁", "📚", "🧠", "💡", "🔬", "💻", "🚀", "📝",
  "📊", "🎯", "🌐", "⚡", "🎨", "🏛️", "💼", "🤖",
];

export default function WorkspacesPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // Workspace API queries & mutations
  const {
    data: workspaces = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useWorkspaces();

  const createWorkspaceMutation = useCreateWorkspace();
  const deleteWorkspaceMutation = useDeleteWorkspace();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [workspaceIcon, setWorkspaceIcon] = useState("📁");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Delete dialog state
  const [workspaceToDelete, setWorkspaceToDelete] = useState<Workspace | null>(
    null
  );

  const filteredWorkspaces = workspaces.filter((workspace) => {
    const query = search.toLowerCase();
    const title = (workspace.title || workspace.name || "").toLowerCase();
    const desc = (workspace.description || "").toLowerCase();
    return title.includes(query) || desc.includes(query);
  });

  const handleCreateWorkspace = async () => {
    if (!workspaceName.trim()) return;
    setErrorMessage(null);

    try {
      const created = await createWorkspaceMutation.mutateAsync({
        title: workspaceName.trim(),
        description:
          workspaceDescription.trim() ||
          "A new workspace for your sources and AI conversations.",
        icon: workspaceIcon || "📁",
      });

      setWorkspaceName("");
      setWorkspaceDescription("");
      setWorkspaceIcon("📁");
      setDialogOpen(false);

      if (created?.id) {
        router.push(`/workspaces/${created.id}`);
      }
    } catch (err: any) {
      setErrorMessage(
        err?.message || "Failed to create workspace. Please try again."
      );
    }
  };

  const confirmDeleteWorkspace = async () => {
    if (!workspaceToDelete) return;
    try {
      await deleteWorkspaceMutation.mutateAsync(workspaceToDelete.id);
      setWorkspaceToDelete(null);
    } catch (err) {
      console.error("Failed to delete workspace:", err);
    }
  };

  const handleGoogleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  const userInitials =
    session?.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        {/* ───────────────── Sidebar ───────────────── */}
        <aside className="hidden w-64 shrink-0 border-r bg-muted/30 md:flex md:flex-col">
          <div className="flex h-16 items-center gap-2 px-6">
            <NotebookPen className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold tracking-tight">Quire</span>
          </div>

          <Separator />

          <nav className="flex-1 space-y-1 p-4">
            <Button variant="secondary" className="w-full justify-start gap-3">
              <LayoutGrid className="h-4 w-4" />
              Workspaces
            </Button>

            <Button variant="ghost" className="w-full justify-start gap-3">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </nav>

          <div className="border-t p-4">
            <div className="flex items-center gap-3 rounded-lg p-2">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {session?.user?.name || "Guest User"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {session?.user?.email || ""}
                </p>
              </div>

              <Button onClick={handleGoogleLogout} variant="ghost" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </aside>

        {/* ───────────────── Main Content ───────────────── */}
        <main className="min-w-0 flex-1">
          {/* Header */}
          <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
            <div className="flex h-16 items-center justify-between px-6 md:px-10">
              <div>
                <h1 className="text-lg font-semibold">Workspaces</h1>
                <p className="hidden text-xs text-muted-foreground sm:block">
                  Organize your sources and AI conversations.
                </p>
              </div>

              {/* Create Workspace Dialog */}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Create workspace</span>
                    <span className="sm:hidden">Create</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[480px]">
                  <DialogHeader>
                    <DialogTitle>Create a workspace</DialogTitle>
                    <DialogDescription>
                      Create a workspace to keep your sources, research and AI
                      conversations together.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-5 py-4">
                    {errorMessage && (
                      <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label
                        htmlFor="workspace-name"
                        className="text-sm font-medium"
                      >
                        Workspace name
                      </label>
                      <Input
                        id="workspace-name"
                        placeholder="e.g. Machine Learning Research"
                        value={workspaceName}
                        onChange={(event) =>
                          setWorkspaceName(event.target.value)
                        }
                        autoFocus
                        disabled={createWorkspaceMutation.isPending}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && workspaceName.trim()) {
                            e.preventDefault();
                            void handleCreateWorkspace();
                          }
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="workspace-description"
                        className="text-sm font-medium"
                      >
                        Description
                        <span className="ml-1 text-muted-foreground">
                          (optional)
                        </span>
                      </label>
                      <Textarea
                        id="workspace-description"
                        placeholder="What will you use this workspace for?"
                        value={workspaceDescription}
                        onChange={(event) =>
                          setWorkspaceDescription(event.target.value)
                        }
                        className="resize-none"
                        rows={3}
                        disabled={createWorkspaceMutation.isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Icon
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {WORKSPACE_ICONS.map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            onClick={() => setWorkspaceIcon(icon)}
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-lg border text-base transition-all hover:scale-105 hover:bg-muted",
                              workspaceIcon === icon
                                ? "border-primary bg-primary/15 ring-2 ring-primary/30"
                                : "border-border bg-background"
                            )}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => setDialogOpen(false)}
                      disabled={createWorkspaceMutation.isPending}
                    >
                      Cancel
                    </Button>

                    <Button
                      onClick={handleCreateWorkspace}
                      disabled={
                        !workspaceName.trim() ||
                        createWorkspaceMutation.isPending
                      }
                      className="gap-2"
                    >
                      {createWorkspaceMutation.isPending && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      <span>
                        {createWorkspaceMutation.isPending
                          ? "Creating..."
                          : "Create workspace"}
                      </span>
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </header>

          {/* Body Content */}
          <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">
            {/* Search Bar */}
            <div className="mb-8 flex items-center justify-between gap-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search workspaces..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="pl-9"
                />
              </div>

              {!isLoading && !isError && (
                <p className="hidden text-sm text-muted-foreground sm:block">
                  {filteredWorkspaces.length} workspace
                  {filteredWorkspaces.length !== 1 && "s"}
                </p>
              )}
            </div>

            {/* Error State */}
            {isError && (
              <div className="mb-6 flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>
                    {error?.message ||
                      "Failed to load workspaces from the server."}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="gap-1.5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Retry
                </Button>
              </div>
            )}

            {/* Loading Skeletons */}
            {isLoading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="flex min-h-[230px] flex-col rounded-xl border bg-card p-5"
                  >
                    <div className="flex items-start justify-between">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                    <div className="mt-5 space-y-2 flex-1">
                      <Skeleton className="h-5 w-3/4 rounded-md" />
                      <Skeleton className="h-4 w-full rounded-md" />
                      <Skeleton className="h-4 w-1/2 rounded-md" />
                    </div>
                    <div className="mt-5 flex gap-4">
                      <Skeleton className="h-4 w-20 rounded-md" />
                      <Skeleton className="h-4 w-24 rounded-md" />
                    </div>
                    <Separator className="my-4" />
                    <Skeleton className="h-8 w-32 rounded-md" />
                  </div>
                ))}
              </div>
            ) : filteredWorkspaces.length > 0 ? (
              /* Workspace Grid */
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filteredWorkspaces.map((workspace) => (
                  <WorkspaceCard
                    key={workspace.id}
                    workspace={workspace}
                    onDelete={() => setWorkspaceToDelete(workspace)}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <EmptyState search={search} onCreate={() => setDialogOpen(true)} />
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={Boolean(workspaceToDelete)}
        onOpenChange={(open) => !open && setWorkspaceToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete workspace</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;
              {workspaceToDelete?.title || workspaceToDelete?.name}&quot;? This
              action cannot be undone and will permanently remove all associated
              sources and conversations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteWorkspaceMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void confirmDeleteWorkspace();
              }}
              disabled={deleteWorkspaceMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteWorkspaceMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ───────────────── Workspace Card ───────────────── */

function WorkspaceCard({
  workspace,
  onDelete,
}: {
  workspace: Workspace;
  onDelete: () => void;
}) {
  const router = useRouter();
  const displayName = workspace.title || workspace.name || "Untitled Workspace";
  const displayDesc =
    workspace.description || "A workspace for your sources and AI conversations.";
  const displaySources = workspace.sourcesCount ?? workspace.sources ?? 0;
  const displayUpdated = formatWorkspaceDate(
    workspace.updatedAt || workspace.createdAt
  );

  return (
    <div
      onClick={() => router.push(`/workspaces/${workspace.id}`)}
      className="group relative flex min-h-[230px] cursor-pointer flex-col rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Top */}
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary text-xl">
          {workspace.icon ? (
            <span>{workspace.icon}</span>
          ) : (
            <FolderOpen className="h-5 w-5" />
          )}
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => router.push(`/workspaces/${workspace.id}`)}
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open workspace
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                className="gap-2 text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div className="mt-5 flex-1">
        <h2 className="line-clamp-1 font-semibold text-card-foreground">
          {displayName}
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {displayDesc}
        </p>
      </div>

      {/* Metadata */}
      <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          {displaySources} {displaySources === 1 ? "source" : "sources"}
        </span>

        <span className="flex items-center gap-1.5">
          <Clock3 className="h-3.5 w-3.5" />
          {displayUpdated}
        </span>
      </div>

      <Separator className="my-4" />

      {/* Open Button */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          className="group/button -ml-2 w-fit gap-2 px-2 text-primary"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/workspaces/${workspace.id}`);
          }}
        >
          Open workspace
          <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}

/* ───────────────── Empty State ───────────────── */

function EmptyState({
  search,
  onCreate,
}: {
  search: string;
  onCreate: () => void;
}) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {search ? <Search className="h-5 w-5" /> : <FolderOpen className="h-5 w-5" />}
      </div>

      <h2 className="mt-4 font-semibold text-base">
        {search ? "No workspaces found" : "Create your first workspace"}
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {search
          ? "Try searching with a different workspace name or keyword."
          : "A workspace keeps your sources, notes and AI conversations together."}
      </p>

      {!search && (
        <Button onClick={onCreate} className="mt-6 gap-2">
          <Plus className="h-4 w-4" />
          Create workspace
        </Button>
      )}
    </div>
  );
}
