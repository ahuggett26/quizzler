import db from "../client";
import { createAllSchema } from "../schema";
import { seedCountries } from "./countriesSeed";

function findExisting(tableName: string): number {
  return (
    db.prepare(`SELECT COUNT(*) as count FROM ${tableName}`).get() as {
      count: number;
    }
  ).count;
}

export function clearTableOrSkip(tableName: string): boolean {
  const existing = findExisting(tableName);

  if (existing > 0) {
    if (process.argv.includes("--force")) {
      db.exec(`DELETE FROM ${tableName}`);
      console.log(`✓ Cleared existing data in ${tableName} table`);
    } else {
      console.log(
        `ℹ Database table ${tableName} already contains ${existing} entries. Skipping seed.`,
      );
      return true;
    }
  }
  return false;
}

function seed(): void {
  const res = seedCountries();
  if (!res) {
    console.log(
      "  Some seeds were skipped due to existing data. Run with --force to re-seed.",
    );
  }
  console.log("✓ Database seeding complete");
}

createAllSchema();
seed();
