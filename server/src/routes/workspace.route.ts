import {Router} from "express";
import { requireAuth } from "../middlewares/auth.moddleware";

export const workSpaceRoute = Router();

workSpaceRoute.use(requireAuth);

workSpaceRoute.route("/").get();