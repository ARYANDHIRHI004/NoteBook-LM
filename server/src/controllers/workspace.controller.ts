import type { Request, Response } from "express";
import { createWorkspace, getAllWorkspacesByUserIdService, getWorkspaceByIdService } from "../services/workspace.service.js";
import { UnauthorizedError } from "../utils/api.error.js";
import { Workspace } from "../repositories/workspace.repository.js";

export async function createWorkspaceForUser(req: Request, res: Response) {
  const data = req.body;
  const userId = req.session?.user.id;

  if (!userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  const workspace = await createWorkspace(data, userId);

  return res.status(201).json(workspace);
}

export async function getAllWorkspacesByUserId(req: Request, res: Response) {
  const userId = req.session?.user.id;

  if (!userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  const workspaces = await getAllWorkspacesByUserIdService(userId);

  return res.status(200).json(workspaces);``
}

export async function getWorkspaceById(req: Request, res: Response){
    const userId = req.session?.user.id
    const {workspaceId} = req.params

    if (!userId) {
        throw new UnauthorizedError("Unauthorized");
      }

    const workspace = getWorkspaceByIdService(workspaceId as string, userId);

}