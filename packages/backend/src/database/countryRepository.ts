import db from "./client";
import type { Country } from "@quizzler/shared";
import { CountrySeedEntry } from "./init/countriesSeed";

interface CountryRow extends CountrySeedEntry {
  id: number;
}

function isoToFlagUrl(isoCode: string): string {
  return `https://flagcdn.com/w320/${isoCode.toLowerCase()}.png`;
}

function rowToCountry(row: CountryRow): Country {
  return {
    id: row.id,
    name: row.name,
    capital: row.capital,
    flagUrl: isoToFlagUrl(row.iso_code),
    population: row.population,
    areaKm2: row.area_km2,
  };
}

export const countryRepository = {
  getAll(): Country[] {
    const rows = db
      .prepare("SELECT * FROM countries ORDER BY name")
      .all() as CountryRow[];
    return rows.map(rowToCountry);
  },

  getById(id: number): Country | null {
    const row = db.prepare("SELECT * FROM countries WHERE id = ?").get(id) as
      | CountryRow
      | undefined;
    return row ? rowToCountry(row) : null;
  },

  getRandom(count: number): Country[] {
    const rows = db
      .prepare("SELECT * FROM countries ORDER BY RANDOM() LIMIT ?")
      .all(count) as CountryRow[];
    return rows.map(rowToCountry);
  },

  getComparison(denylist: number[]): Country {
    const rows = db
      .prepare("SELECT * FROM countries WHERE id NOT IN (?) ORDER BY RANDOM() LIMIT 1")
      .all(denylist) as CountryRow[];
    return rows.map(rowToCountry)[0];
  },

  getCount(): number {
    const result = db
      .prepare("SELECT COUNT(*) as count FROM countries")
      .get() as { count: number };
    return result.count;
  },
};
