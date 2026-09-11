import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./config/auth.js";

const app = express();

app.get("/api/auth/{*any}", toNodeHandler(auth));
app.post("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

export default app;
