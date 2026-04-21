import { Question } from "@quizzler/shared";
import { comparisonOptionText } from "@quizzler/shared/src/util";
import React from "react";
import { useLocation, useNavigate } from "react-router";
import styles from "./QuizSummary.module.css";
import PrimaryButton from "../components/common/PrimaryButton";

export type UserAnswer = {
  answer: string;
  correct: boolean;
};

type QuizCompleteLocationState = {
  questions: Question[];
  userAnswers: UserAnswer[];
};

export default function QuizComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as QuizCompleteLocationState | null | undefined;

  const questions = state?.questions ?? [];
  const userAnswers = state?.userAnswers ?? [];
  const score = userAnswers.filter((answer) => answer.correct).length;

  function getCorrectAnswer(question: Question) {
    if (question.type === "single") {
      return question.answer;
    }
    return comparisonOptionText(question.answerId, question);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quiz complete</h1>
      <p className={styles.score}>
        Your score: {score} / {questions.length}
      </p>
      <section className={styles.summaryList}>
        {questions.map((question, index) => {
          const answer = userAnswers[index];

          return (
            <p key={`question-${index}`} className={styles.summaryRow}>
              <span className={styles.questionLabel}>Question {index + 1}</span>
              <span>{answer?.correct ? "✅" : "❌"}</span>
              <span>
                <i>{answer?.answer ?? "-"}</i>
              </span>
              <span>{getCorrectAnswer(question)}</span>
            </p>
          );
        })}
      </section>
      <PrimaryButton onClick={() => navigate("/")}>Back to home</PrimaryButton>
    </div>
  );
}
