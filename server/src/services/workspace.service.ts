import {
  findWorkSpcaceByIdAndUserId,
  findWorkSpcaceByUserId,
  insertWorkspace,
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
