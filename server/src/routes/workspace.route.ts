import {Router} from "express";
import { requireAuth } from "../middlewares/auth.moddleware";
import { createWorkspaceForUser, deleteWorkspaceById, getAllWorkspacesByUserId, getWorkspaceById, updateWorkspaceById } from "../controllers/workspace.controller";

export const workSpaceRoute = Router();

workSpaceRoute.use(requireAuth);

workSpaceRoute.route("/create-workspace").post(createWorkspaceForUser);
workSpaceRoute.route("/get-all-workspaces-by-userId").get(getAllWorkspacesByUserId);
workSpaceRoute.route("/get-workspace-by-id/:workspaceId").get(getWorkspaceById);
workSpaceRoute.route("/delete-workspace-by-id/:workspaceId").get(deleteWorkspaceById);
workSpaceRoute.route("/update-workspace-by-id/:workspaceId").get(updateWorkspaceById);