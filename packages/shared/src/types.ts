export interface User {
  id: string;
  name: string;
}

type ImageFlashcard = {
  type: "image";
  id: number;
  image: string;
  text?: string;
};

type TextFlashcard = {
  type: "text";
  id: number;
  text: string;
};

export type Flashcard = ImageFlashcard | TextFlashcard;

export type SingleQuestion = {
  type: "single";
  question: string;
  details: string;
  flashcard: Flashcard;
  answer: string;
  answerType: CountryAnswerType;
};

export type ComparisonQuestion = {
  type: "comparison";
  question: string;
  details: string;
  options: readonly [Flashcard, Flashcard];
  answerId: number;
};

export type Question = SingleQuestion | ComparisonQuestion;

export interface Country {
  id: number;
  name: string;
  capital: string;
  flagUrl: string;
  population: number;
  areaKm2: number;
}

export type CountryQuestionType =
  | "flag"
  | "capital"
  | "capital-country"
  | "population-compare"
  | "area-compare"
  | "any";

export type GetCountryQuestionsParams = {
  type: CountryQuestionType;
  count?: number;
};

export type CountryAnswerType = "country" | "capital";
