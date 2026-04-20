import { CountryAliases } from "./aliases/countryAliases";
import { CountryAnswerType } from "./types";

export function checkAnswer(
  userAnswer: string,
  correctAnswer: string,
  answerType: CountryAnswerType,
): boolean {
  // Lowercase, trim, and collapse internal whitespace for user answer
  const normUser = userAnswer.trim().toLowerCase().replace(/\s+/g, " ");
  const normCorrect = correctAnswer.toLowerCase();

  if (normUser === normCorrect) {
    return true;
  }

  switch (answerType) {
    case "capital":
      // TODO: Add common capital name aliases
      return false;
    case "country":
      return CountryAliases[normUser] === normCorrect;
    default:
      return false;
  }
}
