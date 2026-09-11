import {
    deleteWorkspaceById,
  findWorkSpcaceByIdAndUserId,
  findWorkSpcaceByUserId,
  insertWorkspace,
  updateWorkspaceById,
  type Workspace,
} from "../repositories/workspace.repository";

export async function createWorkspace(data: Workspace, userId: string) {
  const workspace = await insertWorkspace(data, userId);
  return workspace;
}

export async function getAllWorkspacesByUserIdService(userId: string) {
  const workspaces = await findWorkSpcaceByUserId(userId);
  return workspaces;
}

export async function getWorkspaceByIdService(
  workspaceId: string,
  userId: string,
) {
  const workspace = await findWorkSpcaceByIdAndUserId(workspaceId, userId);
  return workspace;
}

export async function deleteWorkspaceByIdService(workspaceId: string, userId: string) {
  const workspace = await deleteWorkspaceById(workspaceId, userId);
  return workspace;
}

export async function updateWorkspaceByIdservice(workspaceId: string, input: Workspace, userId: string) {
    const updateWorkspace = await updateWorkspaceById(workspaceId, input);
    return updateWorkspace;
}