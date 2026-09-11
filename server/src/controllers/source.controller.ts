import { Request, Response } from "express";
import { UnauthorizedError, ValidationError } from "../utils/api.error.js";
import { uploadPdfSource } from "../services/source.service.js";

export async function uploadPdf(req: Request, res: Response) {
  const { workspaceId } = req.params;
  const userId = req.session?.user.id;

  if (!req.file) {
    throw new ValidationError("PDF file is required");
  }

  const title = typeof req.body.title === "string" ? req.body.title : undefined;
  if (!userId) throw new UnauthorizedError("Unauthorized");

  const source = await uploadPdfSource(
    workspaceId as string,
    userId,
    req.file,
    title,
  );

  res.status(201).json(source);
}
