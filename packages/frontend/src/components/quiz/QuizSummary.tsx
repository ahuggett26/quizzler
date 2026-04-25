import { Question } from "@quizzler/shared";
import { comparisonOptionText } from "@quizzler/shared/src/util";
import React from "react";
import { useNavigate } from "react-router";
import styles from "./QuizSummary.module.css";
import PrimaryButton from "../common/PrimaryButton";
import { UserAnswer } from "../../types/UserAnswer";
import { DailyQuizResult } from "../../storage/quizStorage";

interface DailyQuizSummaryProps {
  type: "daily";
  questions: Question[];
  dailyQuizResult: DailyQuizResult;
}

interface QuizSummaryProps {
  type: "practice";
  questions: Question[];
  userAnswers: UserAnswer[];
}

export default function QuizSummary(
  props: QuizSummaryProps | DailyQuizSummaryProps,
) {
  const navigate = useNavigate();

  const userAnswers =
    props.type === "practice"
      ? props.userAnswers
      : props.dailyQuizResult.answers;
  const score = userAnswers.filter((answer) => answer.correct).length;

  function getCorrectAnswer(question: Question) {
    if (question.type === "single") {
      return question.answer;
    }
    return comparisonOptionText(question.answerId, question);
  }

  let title = "Quiz complete";
  if (props.type === "daily") {
    const date = new Date(props.dailyQuizResult.date);
    title = date.toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.score}>
        Your score: {score} / {props.questions.length}
      </p>
      <section className={styles.summaryList}>
        {props.questions.map((question, index) => {
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
