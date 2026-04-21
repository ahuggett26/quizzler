import { Question } from "@quizzler/shared";
import { comparisonOptionText } from "@quizzler/shared/src/util";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SingleQuestion from "../components/questions/SingleQuestion";
import { checkAnswer } from "@quizzler/shared/src/answerChecker";
import styles from "./Quiz.module.css";
import ComparisonQuestion from "../components/questions/ComparisonQuestion";
import AnswerDisplay from "../components/questions/AnswerDisplay";
import { UserAnswer } from "./QuizSummary";

export default function Quiz() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionCount, setQuestionCount] = useState(1);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [questionResult, setQuestionResult] = useState<boolean | null>(null);
  const currentQuestion = questions[questionCount - 1];
  const questionAnswered = questionResult !== null;
  const score = userAnswers.filter((answer) => answer.correct).length;

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
      state: { questions, userAnswers },
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
          disabled={questionAnswered}
          onSubmit={(answer) => {
            const isCorrect = checkAnswer(
              answer,
              currentQuestion.answer,
              currentQuestion.answerType,
            );
            setUserAnswers((answers) => [
              ...answers,
              { answer, correct: isCorrect },
            ]);
            setQuestionResult(isCorrect);
          }}
        />
      )}
      {currentQuestion && currentQuestion.type === "comparison" && (
        <ComparisonQuestion
          {...currentQuestion}
          disabled={questionAnswered}
          onSubmit={(answerId) => {
            const isCorrect = answerId === currentQuestion.answerId;
            setUserAnswers((answers) => [
              ...answers,
              {
                answer: comparisonOptionText(answerId, currentQuestion),
                correct: isCorrect,
              },
            ]);
            setQuestionResult(isCorrect);
          }}
        />
      )}
      {questionAnswered && (
        <AnswerDisplay
          isCorrect={questionResult}
          details={currentQuestion.details}
          onNext={nextQuestion}
        />
      )}
    </div>
  );
}
