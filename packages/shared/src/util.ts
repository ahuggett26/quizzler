import { ComparisonQuestion } from "./types";

export function comparisonOptionText(
  choiceId: number,
  question: ComparisonQuestion,
) {
  const flashcard = question.options.find((option) => option.id === choiceId);
  return flashcard?.text ?? "";
}
