import { Question } from "@quizzler/shared";
import { comparisonOptionText } from "@quizzler/shared/src/util";
import React from "react";
import { useLocation, useNavigate } from "react-router";
import styles from "./QuizSummary.module.css";
import PrimaryButton from "../common/PrimaryButton";

export type UserAnswer = {
  answer: string;
  correct: boolean;
};

type QuizSummaryLocationState = {
  questions: Question[];
  userAnswers: UserAnswer[];
};

export default function QuizSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as QuizSummaryLocationState | null | undefined;

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
          const correctAnswer = getCorrectAnswer(question);

          return (
            <details key={`question-${index}`} className={styles.dropdown}>
              <summary className={styles.dropdownHeader}>
                <span className={styles.questionLabel}>
                  Question {index + 1}
                </span>
                <span>{answer?.correct ? "✅" : "❌"}</span>
                <span>{correctAnswer}</span>
                <span className={styles.chevron} aria-hidden="true">
                  V
                </span>
              </summary>
              <div className={styles.dropdownBody}>
                <p className={styles.answerLine}>
                  <span>Your answer: </span>
                  <i>{answer?.answer ?? "-"}</i>
                </p>
                <p className={styles.detailsText}>{question.details}</p>
              </div>
            </details>
          );
        })}
      </section>
      <PrimaryButton onClick={() => navigate("/")}>Back to home</PrimaryButton>
    </div>
  );
}
