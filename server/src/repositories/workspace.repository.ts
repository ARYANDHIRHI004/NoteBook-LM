import { and, eq } from "drizzle-orm";
import { db } from "../config/db";
import { workspace } from "../models/workspace.model";

export type Workspace = {
    id?: string;
    title: string;
    description?: string;
    icon?: string;
    defaultModel?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export async function insertWorkspace(data: Partial<Workspace> & { name?: string }, userId: string){
    const title = data.title || data.name || "Untitled Workspace";
    const [created] = await db.insert(workspace).values({
        title,
        description: data.description,
        icon: data.icon,
        defaultModel: data.defaultModel,
        userId
    }).returning();
    return created;
}

export async function findWorkSpcaceByUserId(userId: string){
    return await db.select().from(workspace).where(eq(workspace.userId, userId));
}

export async function findWorkSpcaceByIdAndUserId(workspaceId: string, userId: string){
    const [found] = await db.select().from(workspace).where(and(eq(workspace.id, workspaceId), eq(workspace.userId, userId)));
    return found;
}

export async function updateWorkspaceById(workspaceId: string, data: Partial<Workspace> & { name?: string }, userId?: string){
    const updateData: Record<string, any> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.name !== undefined) updateData.title = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.defaultModel !== undefined) updateData.defaultModel = data.defaultModel;

    const condition = userId
        ? and(eq(workspace.id, workspaceId), eq(workspace.userId, userId))
        : eq(workspace.id, workspaceId);

    const [updated] = await db.update(workspace).set(updateData).where(condition).returning();
    return updated;
}

export async function deleteWorkspaceById(workspaceId: string, userId: string){
    const [deleted] = await db.delete(workspace).where(and(eq(workspace.id, workspaceId), eq(workspace.userId, userId))).returning();
    return deleted ?? { id: workspaceId, success: true };
}