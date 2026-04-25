import { Question } from "@quizzler/shared";
import { useEffect, useState } from "react";
import Quiz from "./Quiz";
import { UserAnswer } from "../../types/UserAnswer";
import QuizSummary from "./QuizSummary";

export default function PracticeQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[] | null>(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/questions?type=any&count=5")
      .then((res) => res.json())
      .then((data) => setQuestions(data as Question[]));
  }, []);

  if (userAnswers === null) {
    return (
      <Quiz
        questions={questions}
        onComplete={(userAnswers) => setUserAnswers(userAnswers)}
      />
    );
  }
  return (
    <QuizSummary
      type="practice"
      questions={questions}
      userAnswers={userAnswers}
    />
  );
}
