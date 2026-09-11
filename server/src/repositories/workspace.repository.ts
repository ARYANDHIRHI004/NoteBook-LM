import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { workspace } from "../models/workspace.model";

export type Workspace = {
    id: string;
    title: string;
    description?: string;
    icon: string;
    defaultModel?: string;
    createdAt: Date;
    updatedAt: Date;
}
export async function insertWorkspace(data: Workspace, userId: string){
    return await db.insert(workspace).values({...data, userId});
}

export async function findWorkSpcaceByUserId(userId: string){
    return await db.select().from(workspace).where(eq(workspace.userId, userId));
}

export async function findWorkSpcaceByIdAndUserId(workspaceId: string, userId: string){
    return await db.select().from(workspace).where(eq(workspace.id, workspaceId) && eq(workspace.userId, userId));
}

export async function updateWorkspaceById(workspaceId: string, data: Workspace){
    return await db.update(workspace).set(data).where(eq(workspace.id, workspaceId));
}

export async function deleteWorkspaceById(workspaceId: string){
    return await db.delete(workspace).where(eq(workspace.id, workspaceId));
}