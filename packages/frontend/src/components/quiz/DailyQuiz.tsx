import { Question } from "@quizzler/shared";
import { useEffect, useState } from "react";
import Quiz from "./Quiz";
import {
  DailyQuizResult,
  getQuizResult,
  saveQuizResult,
} from "../../storage/quizStorage";
import QuizSummary from "./QuizSummary";

export default function DailyQuiz() {
  const fetchDate = new Date();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [existingResult, setExistingResult] = useState<DailyQuizResult | null>(
    null,
  );

  useEffect(() => {
    setExistingResult(getQuizResult(fetchDate));
    fetch("http://localhost:4000/api/questions/daily")
      .then((res) => res.json())
      .then((data) => setQuestions(data as Question[]));
  }, []);

  if (existingResult === null) {
    return (
      <Quiz
        questions={questions}
        onComplete={(userAnswers) => {
          const results = saveQuizResult(fetchDate, userAnswers);
          setExistingResult(results);
        }}
      />
    );
  }
  return (
    <QuizSummary
      type="daily"
      questions={questions}
      dailyQuizResult={existingResult}
    />
  );
}
