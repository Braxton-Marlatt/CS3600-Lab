import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs";


// --- Configuration
const app: Application = express()

// CORS must be before everything, including the better-auth handler
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// API routes

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({status: "ok"});
});


// Serve React app in production
const publicDir = path.join(__dirname, "../../public");
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  app.get(/^(?!\/api).*/, (_req: Request, res: Response) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

// Catch all error route (has to be the last one)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({error: err.message || "Internal Server Error"});
})

export default app;