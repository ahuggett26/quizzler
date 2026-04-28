import express from "express";
import cors from "cors";
import type { User } from "@quizzler/shared";
import questionsRouter from "./routes/questions";
import { createAllSchema } from "./database/schema";

const app = express();
const port = process.env.PORT ?? 4000;

// ─── Middleware ───────────────────────────────────────────────────────────────────────────

const allowedOrigins = [
  "http://localhost:5173",
  "https://ajh-quizzler.netlify.app",
  "https://ajh-quizzler.netlify.app/geography-practice",
];
app.use(
  cors({
    origin: (
      requestOrigin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!requestOrigin || allowedOrigins.includes(requestOrigin)) {
        callback(null, true);
      } else {
        callback(
          new Error(`CORS blocked: origin ${requestOrigin} is not allowed`),
        );
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────────────────

app.get("/user", (_req, res) => {
  const user: User = { id: "1", name: "Alice" };
  res.json(user);
});

app.use("/api/questions", questionsRouter);

// ─── Start Server ─────────────────────────────────────────────────────────────────────────

createAllSchema();

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`✓ Backend running at http://localhost:${port}`);
});
