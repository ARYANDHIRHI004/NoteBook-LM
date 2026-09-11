import {Router} from "express";
import { requireAuth } from "../middlewares/auth.moddleware";
import { createWorkspaceForUser, getAllWorkspacesByUserId } from "../controllers/workspace.controller";

export const workSpaceRoute = Router();

workSpaceRoute.use(requireAuth);

workSpaceRoute.route("/create-workspace").get(createWorkspaceForUser);
workSpaceRoute.route("/get-all-workspaces-by-userId").get(getAllWorkspacesByUserId);