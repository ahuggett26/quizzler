import { Question } from "@quizzler/shared";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SingleQuestion from "../components/questions/SingleQuestion";
import { checkAnswer } from "@quizzler/shared/src/answerChecker";
import styles from "./Quiz.module.css";
import ComparisonQuestion from "../components/questions/ComparisonQuestion";
import AnswerDisplay from "../components/questions/AnswerDisplay";

export default function Quiz() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionCount, setQuestionCount] = useState(1);
  const [score, setScore] = useState(0);
  const [questionResult, setQuestionResult] = useState<boolean | null>(null);
  const currentQuestion = questions[questionCount - 1];

  useEffect(() => {
    fetch("http://localhost:4000/api/questions?type=any&count=5")
      .then((res) => res.json())
      .then((data) => setQuestions(data as Question[]));
  }, []);

  function nextQuestion() {
    setQuestionResult(null);
    if (questionCount < questions.length) {
      setQuestionCount((c) => c + 1);
      return;
    }

    navigate("/quiz-complete", {
      state: { score, total: questions.length },
    });
  }

  return (
    <div className={styles.container}>
      <h1>Question {questionCount}</h1>
      <p className={styles.score}>
        Score: {score} / {questions.length || 0}
      </p>

      {currentQuestion && currentQuestion.type === "single" && (
        <SingleQuestion
          {...currentQuestion}
          onSubmit={(answer) => {
            const isCorrect = checkAnswer(
              answer,
              currentQuestion.answer,
              currentQuestion.answerType,
            );
            if (isCorrect) {
              setScore((s) => s + 1);
            }
            setQuestionResult(isCorrect);
          }}
        />
      )}
      {currentQuestion && currentQuestion.type === "comparison" && (
        <ComparisonQuestion
          {...currentQuestion}
          onSubmit={(answer) => {
            const isCorrect = answer === currentQuestion.answerId;
            if (isCorrect) {
              setScore((s) => s + 1);
            }
            setQuestionResult(isCorrect);
          }}
        />
      )}
      {questionResult !== null && (
        <AnswerDisplay
          isCorrect={questionResult}
          details={currentQuestion.details}
          onNext={nextQuestion}
        />
      )}
    </div>
  );
}
