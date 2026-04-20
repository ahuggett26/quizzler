import { SingleQuestion as TSingleQuestion } from "@quizzler/shared";
import React, { useEffect, useState } from "react";
import SingleQuestion from "../components/questions/SingleQuestion";
import { checkAnswer } from "@quizzler/shared/src/answerChecker";
import styles from "./Quiz.module.css";

export default function Quiz() {
  const [questions, setQuestions] = useState<TSingleQuestion[]>([]);
  const [questionCount, setQuestionCount] = useState(1);

  useEffect(() => {
    fetch("http://localhost:4000/api/questions?type=any&count=5")
      .then((res) => res.json())
      .then((data) => setQuestions(data as TSingleQuestion[]));
  }, []);

  function nextQuestion() {
    if (questionCount < questions.length) {
      setQuestionCount((c) => c + 1);
    }
  }

  return (
    <div className={styles.container}>
      <h1>Question {questionCount}</h1>
      <SingleQuestion
        {...questions[questionCount - 1]}
        onSubmit={(answer) => {
          const currQ = questions[questionCount - 1];
          const expAns = currQ.answer;
          if (checkAnswer(answer, expAns, currQ.answerType)) {
            alert("Correct!");
          } else {
            alert("Wrong! The correct answer is: " + expAns);
          }
          nextQuestion();
        }}
      />
    </div>
  );
}
