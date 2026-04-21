import React from "react";
import { useLocation, useNavigate } from "react-router";
import styles from "./QuizComplete.module.css";

type QuizCompleteLocationState = {
  score: number;
  total: number;
};

export default function QuizComplete() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as QuizCompleteLocationState | null | undefined;

  const score = state?.score ?? 0;
  const total = state?.total ?? 0;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quiz complete</h1>
      <p className={styles.score}>
        Your score: {score} / {total}
      </p>
      <button className={styles.button} onClick={() => navigate("/")}>
        Back to home
      </button>
    </div>
  );
}
