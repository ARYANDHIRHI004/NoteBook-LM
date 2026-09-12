import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "./config/auth.js";
import { registerRoute } from "./routes/index.js";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import { functions } from "./inngest/functions/index.js";
import cors from "cors";
const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.get("/api/auth/{*any}", toNodeHandler(auth));
app.post("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

registerRoute(app);
app.use("/api/inngest", serve({ client: inngest, functions }));

export default app;
