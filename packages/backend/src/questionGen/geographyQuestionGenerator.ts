import { countryRepository } from "../database/countryRepository";
import {
  Country,
  GetCountryQuestionsParams,
  SingleQuestion,
} from "@quizzler/shared";
import QuestionGenerator from "./questionGenerator";

const DEFAULT_COUNT = 5;

export class GeographyQuestionGenerator implements QuestionGenerator<GetCountryQuestionsParams> {
  generate(params: GetCountryQuestionsParams): SingleQuestion[] {
    const countries = countryRepository.getRandom(
      params.count ?? DEFAULT_COUNT,
    );

    switch (params.type) {
      case "flag":
        return countries.map(this.generateFlagQuestion);
      case "capital":
        return countries.map(this.generateCapitalQuestion);
      case "capital-country":
        return countries.map(this.generateCapitalCountryQuestion);
      case "any":
      default:
        return countries.map((country) => {
          const fns = [
            this.generateFlagQuestion,
            this.generateCapitalQuestion,
            this.generateCapitalCountryQuestion,
          ];
          return fns[Math.floor(Math.random() * fns.length)](country);
        });
    }
  }

  private generateFlagQuestion(country: Country): SingleQuestion {
    return {
      type: "single",
      question: "What country does this flag belong to?",
      flashcard: {
        type: "image",
        image: country.flagUrl,
      },
      answer: country.name,
      answerType: "country",
    };
  }

  private generateCapitalCountryQuestion(country: Country): SingleQuestion {
    return {
      type: "single",
      question: "What country has this capital city?",
      flashcard: {
        type: "text",
        text: country.capital,
      },
      answer: country.name,
      answerType: "country",
    };
  }

  private generateCapitalQuestion(country: Country): SingleQuestion {
    return {
      type: "single",
      question: "What is the capital city of this country?",
      flashcard: {
        type: "image",
        image: country.flagUrl,
        text: country.name,
      },
      answer: country.capital,
      answerType: "capital",
    };
  }
}
