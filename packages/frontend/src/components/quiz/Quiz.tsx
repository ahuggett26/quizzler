import { Question } from "@quizzler/shared";
import { comparisonOptionText } from "@quizzler/shared/src/util";
import React, { useState } from "react";
import SingleQuestion from "../../components/questions/SingleQuestion";
import { checkAnswer } from "@quizzler/shared/src/answerChecker";
import styles from "./Quiz.module.css";
import ComparisonQuestion from "../../components/questions/ComparisonQuestion";
import AnswerDisplay from "../../components/questions/AnswerDisplay";
import { UserAnswer } from "../../types/UserAnswer";

interface QuizProps {
  questions: Question[];
  onComplete: (userAnswers: UserAnswer[]) => void;
}

export default function Quiz({ questions, onComplete }: QuizProps) {
  const [questionCount, setQuestionCount] = useState(1);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [questionResult, setQuestionResult] = useState<boolean | null>(null);
  const currentQuestion = questions[questionCount - 1];
  const questionAnswered = questionResult !== null;
  const score = userAnswers.filter((answer) => answer.correct).length;

  function nextQuestion() {
    setQuestionResult(null);
    if (questionCount < questions.length) {
      setQuestionCount((c) => c + 1);
      return;
    }
    onComplete(userAnswers);
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
