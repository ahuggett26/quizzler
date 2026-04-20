import db from "./client";

export function createAllSchema(): void {
  createCountriesSchema();
}

function createCountriesSchema(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS countries (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL UNIQUE,
      capital     TEXT NOT NULL,
      iso_code    TEXT NOT NULL UNIQUE,
      population  INTEGER NOT NULL,
      area_km2    REAL NOT NULL
    );
  `);

  console.log("✓ Countries schema created");
}
