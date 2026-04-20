import { countryRepository } from "../database/countryRepository";
import {
  Country,
  GetCountryQuestionsParams,
  SingleQuestion,
  Question,
  ComparisonQuestion,
} from "@quizzler/shared";
import QuestionGenerator from "./questionGenerator";

const DEFAULT_COUNT = 5;

export class GeographyQuestionGenerator implements QuestionGenerator<GetCountryQuestionsParams> {
  generate(params: GetCountryQuestionsParams): Question[] {
    const count = params.count ?? DEFAULT_COUNT;
    const countries = countryRepository.getRandom(count);

    switch (params.type) {
      case "flag":
        return countries.map(this.generateFlagQuestion);
      case "capital":
        return countries.map(this.generateCapitalQuestion);
      case "capital-country":
        return countries.map(this.generateCapitalCountryQuestion);
      case "population-compare":
        return countries.map(c => this.generatePopulationComparisonQuestion(c, countryRepository.getComparison(countries.map(c => c.id))));
      case "area-compare":
        return countries.map(c => this.generateAreaComparisonQuestion(c, countryRepository.getComparison(countries.map(c => c.id))));
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
        id: country.id,
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
        id: country.id,
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
        id: country.id,
        image: country.flagUrl,
        text: country.name,
      },
      answer: country.capital,
      answerType: "capital",
    };
  }

  private generatePopulationComparisonQuestion(country1: Country, country2: Country): ComparisonQuestion {
    const answerId =
      country1.population > country2.population
        ? country1.id
        : country2.id;

    return {
      type: "comparison",
      question: "Which country has a larger population?",
      options: [
        {
          type: "image",
          id: country1.id,
          image: country1.flagUrl,
          text: country1.name,
        },
        {
          type: "image",
          id: country2.id,
          image: country2.flagUrl,
          text: country2.name,
        },
      ],
      answerId,
    }
  }

  private generateAreaComparisonQuestion(country1: Country, country2: Country): ComparisonQuestion {
    const answerId =
      country1.areaKm2 > country2.areaKm2
        ? country1.id
        : country2.id;

    return {
      type: "comparison",
      question: "Which country has a larger area?",
      options: [
        {
          type: "image",
          id: country1.id,
          image: country1.flagUrl,
          text: country1.name,
        },
        {
          type: "image",
          id: country2.id,
          image: country2.flagUrl,
          text: country2.name,
        },
      ],
      answerId,
    }
  }
}
