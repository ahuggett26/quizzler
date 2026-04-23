import { Router, Request, Response } from "express";
import { CountryQuestionType } from "@quizzler/shared";
import { GeographyQuestionGenerator } from "../questionGen/geographyQuestionGenerator";

const router = Router();

router.get("/daily", (req: Request, res: Response) => {
  try {
    const generator = new GeographyQuestionGenerator();
    const questions = generator.generateDaily();
    res.json(questions);
  } catch (err) {
    console.error("Error generating daily questions:", err);
    res.status(500).json({ error: "Failed to generate daily questions" });
  }
});

router.get("/", (req: Request, res: Response) => {
  try {
    const type = (req.query.type as CountryQuestionType) ?? "any";
    const count = req.query.count
      ? parseInt(req.query.count as string)
      : undefined;

    if (count && (isNaN(count) || count < 1)) {
      res.status(400).json({ error: "Question count must be at least 1" });
      return;
    }

    const generator = new GeographyQuestionGenerator();
    const questions = generator.generate({ type, count });
    res.json(questions);
  } catch (err) {
    console.error("Error generating questions:", err);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

export default router;
