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
  private countries: Country[] = [];

  private getCountryIds(): number[] {
    return this.countries.map((c) => c.id);
  }

  generate(params: GetCountryQuestionsParams): Question[] {
    const count = params.count ?? DEFAULT_COUNT;
    this.countries = countryRepository.getRandom(count);

    switch (params.type) {
      case "flag":
        return this.countries.map((country) => this.generateFlagQuestion(country));
      case "capital":
        return this.countries.map((country) =>
          this.generateCapitalQuestion(country),
        );
      case "capital-country":
        return this.countries.map((country) =>
          this.generateCapitalCountryQuestion(country),
        );
      case "population-compare":
        return this.countries.map((country) =>
          this.generatePopulationComparisonQuestion(country),
        );
      case "area-compare":
        return this.countries.map((country) =>
          this.generateAreaComparisonQuestion(country),
        );
      case "any":
      default:
        return this.countries.map((country) => {
          const fns = [
            (c: Country) => this.generateFlagQuestion(c),
            (c: Country) => this.generateCapitalQuestion(c),
            (c: Country) => this.generateCapitalCountryQuestion(c),
            (c: Country) => this.generatePopulationComparisonQuestion(c),
            (c: Country) => this.generateAreaComparisonQuestion(c),
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

  private generatePopulationComparisonQuestion(
    country1: Country,
  ): ComparisonQuestion {
    const country2 = countryRepository.getComparison(
      country1,
      "population",
      this.getCountryIds(),
    );
    if (!country2) {
      throw new Error("No comparison country available");
    }
    const answerId =
      country1.population > country2.population ? country1.id : country2.id;

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
    };
  }

  private generateAreaComparisonQuestion(
    country1: Country,
  ): ComparisonQuestion {
    const country2 = countryRepository.getComparison(
      country1,
      "area_km2",
      this.getCountryIds(),
    );
    if (!country2) {
      throw new Error("No comparison country available");
    }
    const answerId =
      country1.areaKm2 > country2.areaKm2 ? country1.id : country2.id;

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
    };
  }
}
