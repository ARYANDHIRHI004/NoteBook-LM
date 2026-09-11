import { findWorkSpcaceByUserId, insertWorkspace, type Workspace } from "../repositories/workspace.repository";

export async function createWorkspace(data: Workspace, userId: string){
    const workspace = await insertWorkspace(data, userId);
    return workspace
}

export async function getAllWorkspacesByUserIdService(userId: string){
    const workspaces = await findWorkSpcaceByUserId(userId);
    return workspaces
}