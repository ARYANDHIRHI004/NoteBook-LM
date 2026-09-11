import type { Request, Response } from "express";
import { createWorkspace } from "../services/workspace.service.js";
import { UnauthorizedError } from "../utils/api.error.js";

export async function createWorkspaceForUser(req: Request, res: Response) {
  const data = req.body;
  const userId = req.session?.user.id;

  if(!userId){
    throw new UnauthorizedError("Unauthorized");
  }

  const workspace = await createWorkspace(data, userId);

  return res.status(201).json(workspace);
}
