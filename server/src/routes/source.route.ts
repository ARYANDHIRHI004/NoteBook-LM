import { Router } from "express";
import { uploadSinglePdf } from "../middlewares/multer.middleware.js";
import { uploadPdf, listSources, deleteSource } from "../controllers/source.controller.js";
import { requireAuth } from "../middlewares/auth.moddleware.js";

export const sourceRoute = Router();

sourceRoute.use(requireAuth);

sourceRoute.route("/upload/:workspaceId").post(uploadSinglePdf, uploadPdf);
sourceRoute.route("/:workspaceId").get(listSources);
sourceRoute.route("/:workspaceId/:sourceId").delete(deleteSource);
