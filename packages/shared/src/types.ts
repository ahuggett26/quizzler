export interface User {
  id: string;
  name: string;
}

type ImageFlashcard = {
  type: "image";
  image: string;
  text?: string;
};

type TextFlashcard = {
  type: "text";
  text: string;
};

export type Flashcard = ImageFlashcard | TextFlashcard;

export type SingleQuestion = {
  type: "single";
  question: string;
  flashcard: Flashcard;
  answer: string;
  answerType: CountryAnswerType;
};

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
  | "any";

export type GetCountryQuestionsParams = {
  type: CountryQuestionType;
  count?: number;
};

export type CountryAnswerType = "country" | "capital";
