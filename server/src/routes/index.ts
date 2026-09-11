import { Application } from "express";
import { workSpaceRoute } from "./workspace.route";

export function registerRoute(app: Application){
    app.use("api/v1/workspace", workSpaceRoute)
}