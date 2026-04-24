import { Question } from "@quizzler/shared";
import { useEffect, useState } from "react";
import Quiz from "./Quiz";
import { useNavigate } from "react-router";

export default function DailyQuiz() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/questions/daily")
      .then((res) => res.json())
      .then((data) => setQuestions(data as Question[]));
  }, []);

  return (
    <Quiz
      questions={questions}
      onComplete={(userAnswers) =>
        navigate("/quiz-complete", {
          state: { questions, userAnswers },
        })
      }
    />
  );
}
