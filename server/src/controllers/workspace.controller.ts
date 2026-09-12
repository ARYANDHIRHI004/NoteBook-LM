import type { Request, Response } from "express";
import {
  createWorkspace,
  deleteWorkspaceByIdService,
  getAllWorkspacesByUserIdService,
  getWorkspaceByIdService,
  updateWorkspaceByIdservice,
} from "../services/workspace.service.js";
import { UnauthorizedError } from "../utils/api.error.js";

export async function createWorkspaceForUser(req: Request, res: Response) {
  const data = req.body;
  const userId = req.session?.user.id;

  if (!userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  console.log(data)

  const workspace = await createWorkspace(data, userId);

  return res.status(201).json(workspace);
}

export async function getAllWorkspacesByUserId(req: Request, res: Response) {
  const userId = req.session?.user.id;

  if (!userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  const workspaces = await getAllWorkspacesByUserIdService(userId);

  return res.status(200).json(workspaces);
  ``;
}

export async function getWorkspaceById(req: Request, res: Response) {
  const userId = req.session?.user.id;
  const { workspaceId } = req.params;

  if (!userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  const workspace = await getWorkspaceByIdService(workspaceId as string, userId);
  return res.status(200).json(workspace);
}

export async function deleteWorkspaceById(req: Request, res: Response) {
  const userId = req.session?.user.id;
  const { workspaceId } = req.params;

  if (!userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  const workspace = await deleteWorkspaceByIdService(workspaceId as string, userId);

  return res.status(200).json(workspace);
}

export async function updateWorkspaceById(req: Request, res: Response) {
  const userId = req.session?.user.id;
  const { workspaceId } = req.params;
  const input = req.body;

  if (!userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  const updateWorkspace = await updateWorkspaceByIdservice(
    workspaceId as string,
    input,
    userId,
  );
  return res.status(200).json(updateWorkspace);
}
