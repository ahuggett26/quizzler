import { UserAnswer } from "../types/UserAnswer";

export interface DailyQuizResult {
  date: string; // ISO date string (YYYY-MM-DD)
  answers: UserAnswer[];
  completedAt: number; // timestamp when quiz was completed
}

const STORAGE_KEY = "ajh.quizzler.geography_quiz_results";

/**
 * Get the current date as ISO string (YYYY-MM-DD)
 */
export function getDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Get all quiz results from storage
 */
export function getAllQuizResults(): { [date: string]: DailyQuizResult } {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

/**
 * Get today's quiz result if it exists
 */
export function getQuizResult(date: Date): DailyQuizResult | null {
  const allResults = getAllQuizResults();
  const today = getDateString(date);
  return allResults[today] || null;
}

/**
 * Save quiz result for today
 * @param answers - Array of quiz answers
 * @param correctCount - Number of correct answers
 */
export function saveQuizResult(
  date: Date,
  answers: UserAnswer[],
): DailyQuizResult {
  const today = getDateString(date);
  const allResults = getAllQuizResults();

  const result: DailyQuizResult = {
    date: today,
    answers,
    completedAt: Date.now(),
  };

  allResults[today] = result;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allResults));

  return result;
}

/**
 * Clear all quiz results (useful for testing)
 */
export function clearAllQuizResults(): void {
  localStorage.removeItem(STORAGE_KEY);
}
