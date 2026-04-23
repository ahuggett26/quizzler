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
  getRandom(count: number): Country[] {
    const rows = db
      .prepare("SELECT * FROM countries ORDER BY RANDOM() LIMIT ?")
      .all(count) as CountryRow[];
    return rows.map(rowToCountry);
  },

  /**
   * Daily deterministic picker:
   * 1) Build a month-specific "scrambled ring" via deterministic ORDER BY.
   * 2) Move a window through that ring by day-of-month.
   * 3) Return `count` countries from that window (wrapping by ring math).
   */
  getDailyCountries(
    count: number,
    utcYear: number,
    utcMonth: number,
    utcDayOfMonth: number,
  ): Country[] {    
    if (count < 1) {
      return [];
    }

    // Constants for deterministic monthly ring ordering.
    //
    // A/B: large integer coefficients to create a "well-mixed" ordering signal from
    // country id + monthSeed. We are not doing cryptography here; these simply give
    // a stable, random-looking distribution across rows.
    //
    // MOD: prime modulus (2^31 - 1) keeps values bounded and helps reduce obvious
    // arithmetic patterns in the sort key.
    //
    // STEP: daily ring movement amount. A non-trivial step (37) spreads adjacent days
    // across the ring more than small steps like 1 or 5, improving perceived variety.
    const DAILY_RING_MIX_A = 1103515245;
    const DAILY_RING_MIX_B = 12345;
    const DAILY_RING_MOD = 2147483647; // 2^31 - 1
    const DAILY_RING_STEP = 37;

    const monthSeed = utcYear * 100 + utcMonth;
    /*
      SQL intent:
      - ranked CTE: builds a deterministic monthly "ring" by assigning each country
        a zero-based position (`rn`) using a mixed sort key from `id` + `monthSeed`.
      - meta CTE: computes ring size (`total`) so window math can wrap correctly.
      - WHERE clause: picks a contiguous daily window on that ring.
          start = ((utcDayOfMonth - 1) * DAILY_RING_STEP) % total
        It then keeps rows whose wrapped distance from `start` is < `count`.
      - ORDER BY r.rn: returns rows in stable ring order.
    */
    const query = `
      WITH ranked AS (
        SELECT
          *,
          ROW_NUMBER() OVER (
            ORDER BY ((id * ? + ? * ?) % ?), id
          ) - 1 AS rn
        FROM countries
      ),
      meta AS (
        SELECT COUNT(*) AS total FROM ranked
      )
      SELECT r.*
      FROM ranked r
      CROSS JOIN meta m
      WHERE m.total > 0
        AND (
          (
            r.rn - ((((? - 1) * ?) % m.total) + m.total) % m.total + m.total
          ) % m.total < ?
        )
      ORDER BY r.rn
    `;

    const rows = db.prepare(query).all(
      DAILY_RING_MIX_A,
      monthSeed,
      DAILY_RING_MIX_B,
      DAILY_RING_MOD,
      utcDayOfMonth,
      DAILY_RING_STEP,
      count,
    ) as CountryRow[];

    return rows.map(rowToCountry);
  },

  getComparison(
    referenceCountry: Country,
    metricColumn: "population" | "area_km2",
    denylist: number[],
  ): Country | null {
    const referenceValue =
      metricColumn === "population"
        ? referenceCountry.population
        : referenceCountry.areaKm2;

    const query = `
      SELECT *
      FROM (
        SELECT *
        FROM countries
        WHERE id NOT IN (${denylist.join(",")})
        ORDER BY ABS(${metricColumn} - ?)
        LIMIT 50
      )
      ORDER BY RANDOM()
      LIMIT 1
    `;

    const row = db
      .prepare(query)
      .get(referenceValue) as CountryRow | undefined;

    return row ? rowToCountry(row) : null;
  },
};
