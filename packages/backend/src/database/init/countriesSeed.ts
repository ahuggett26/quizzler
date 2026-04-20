import db from "../client";
import { clearTableOrSkip } from "./seed";
import countriesData from "./countries.json";

export interface CountrySeedEntry {
  name: string;
  capital: string;
  iso_code: string;
  population: number;
  area_km2: number;
}

const tableName = "countries";

export function seedCountries(): boolean {
  if (clearTableOrSkip(tableName)) {
    return false;
  }

  const insert = db.prepare(`
    INSERT INTO ${tableName} (name, capital, iso_code, population, area_km2)
    VALUES (@name, @capital, @iso_code, @population, @area_km2)
  `);
  const countries = countriesData as CountrySeedEntry[];
  const insertAll = db.transaction(() => {
    for (const c of countries) {
      insert.run({
        name: c.name,
        capital: c.capital,
        iso_code: c.iso_code,
        population: c.population,
        area_km2: c.area_km2,
      });
    }
  });
  insertAll();

  const count = (
    db.prepare("SELECT COUNT(*) as count FROM countries").get() as {
      count: number;
    }
  ).count;

  console.log(`✓ Seeded ${count} countries into the database`);
  return true;
}
