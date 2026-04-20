import { Question } from "@quizzler/shared";
import React, { useEffect, useState } from "react";
import SingleQuestion from "../components/questions/SingleQuestion";
import { checkAnswer } from "@quizzler/shared/src/answerChecker";
import styles from "./Quiz.module.css";
import ComparisonQuestion from "../components/questions/ComparisonQuestion";

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionCount, setQuestionCount] = useState(1);
  const [score, setScore] = useState(0);
  const currentQuestion = questions[questionCount - 1];

  useEffect(() => {
    fetch("http://localhost:4000/api/questions?type=any&count=5")
      .then((res) => res.json())
      .then((data) => setQuestions(data as Question[]));
  }, []);

  function nextQuestion() {
    if (questionCount < questions.length) {
      setQuestionCount((c) => c + 1);
    }
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
            if (checkAnswer(answer, currentQuestion.answer, currentQuestion.answerType)) {
              setScore((s) => s + 1);
              alert("Correct!");
            } else {
              alert("Wrong! The correct answer is: " + currentQuestion.answer);
            }
            nextQuestion();
          }}
        />
      )}
      {currentQuestion && currentQuestion.type === "comparison" && (
        <ComparisonQuestion
          {...currentQuestion}
          onSubmit={(answer) => {
            if (answer === currentQuestion.answerId) {
              setScore((s) => s + 1);
              alert("Correct!");
            } else {
              alert("Wrong!");
            }
            nextQuestion();
          }}
        />
      )}
    </div>
  );
}
