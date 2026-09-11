import { insertWorkspace, type Workspace } from "../repositories/workspace.repository";

export async function createWorkspace(data: Workspace, userId: string){
    const workspace = await insertWorkspace(data, userId);
    return workspace
}