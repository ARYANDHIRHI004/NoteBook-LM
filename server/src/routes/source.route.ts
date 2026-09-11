import { Router } from "express";
import { uploadSinglePdf } from "../middlewares/multer.middleware.js";
import { uploadPdf } from "../controllers/source.controller.js";

export const sourceRoute = Router();

sourceRoute.route("/upload").post(uploadSinglePdf, uploadPdf);
