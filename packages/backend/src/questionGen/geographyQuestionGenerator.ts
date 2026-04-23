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

  generateDaily(): Question[] {
    const date = new Date();
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const dayOfMonth = date.getUTCDate();
    this.countries = countryRepository.getDailyCountries(
      DEFAULT_COUNT,
      year,
      month,
      dayOfMonth,
    );

    const builders = [
      (c: Country) => this.generateFlagQuestion(c),
      (c: Country) => this.generateCapitalQuestion(c),
      (c: Country) => this.generateCapitalCountryQuestion(c),
      (c: Country) => this.generatePopulationComparisonQuestion(c),
      (c: Country) => this.generateAreaComparisonQuestion(c),
    ];

    // Deterministic daily variation in question type sequencing.
    const typeOffset = (year * 31 + month * 17 + dayOfMonth) % builders.length;
    return this.countries.map((country, index) => {
      const builder = builders[(index + typeOffset) % builders.length];
      return builder(country);
    });
  }

  private generateFlagQuestion(country: Country): SingleQuestion {
    return {
      type: "single",
      question: "What country does this flag belong to?",
      details: `This is the flag of ${country.name}.`,
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
      details: `This is the capital city of ${country.name}.`,
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
      details: `The capital city of ${country.name} is ${country.capital}.`,
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
    const answer =
      country1.population > country2.population ? country1 : country2;
    const incorrectAns =
      country1.population <= country2.population ? country1 : country2;

    return {
      type: "comparison",
      question: "Which country has a larger population?",
      details: `${answer.name} has a population of ${answer.population}, whereas ${incorrectAns.name} has a population of ${incorrectAns.population}.`,
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
      answerId: answer.id,
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
    const answer =
      country1.areaKm2 > country2.areaKm2 ? country1 : country2;
    const incorrectAns =
      country1.areaKm2 <= country2.areaKm2 ? country1 : country2;

    return {
      type: "comparison",
      question: "Which country has a larger area?",
      details: `${answer.name} has a surface area of ${answer.areaKm2}km², whereas ${incorrectAns.name} has a surface area of ${incorrectAns.areaKm2}km².`,
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
      answerId: answer.id,
    };
  }
}
