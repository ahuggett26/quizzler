import { Question } from "@quizzler/shared";

export default interface QuestionGenerator<T> {
  generate(params: T): Question[];
}
