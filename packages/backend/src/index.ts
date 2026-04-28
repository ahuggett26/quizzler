import express from "express";
import cors from "cors";
import type { User } from "@quizzler/shared";
import questionsRouter from "./routes/questions";
import { createAllSchema } from "./database/schema";

const app = express();
const port = process.env.PORT ?? 4000;

// ─── Middleware ───────────────────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: ["http://localhost:5173", "https://ajh-quizzler.netlify.app/"],
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
