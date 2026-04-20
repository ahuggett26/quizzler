import { SingleQuestion as SingleQuestionProps } from "@quizzler/shared";
import Flashcard from "../cards/Flashcard";
import React from "react";
import styles from "./SingleQuestion.module.css";

export default function SingleQuestion(
  props: SingleQuestionProps & { onSubmit: (answer: string) => void },
) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  function submitAnswer() {
    if (inputRef?.current?.value) {
      props.onSubmit(inputRef.current.value);
      inputRef.current.value = "";
    } else {
      props.onSubmit("");
    }
  }

  return (
    <div className={styles.container}>
      <Flashcard {...props.flashcard} />
      <h3 className={styles.question}>{props.question}</h3>
      <input
        type="text"
        placeholder="Your answer here..."
        ref={inputRef}
        className={styles.input}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            submitAnswer();
          }
        }}
      />
      <button onClick={() => submitAnswer()}>Submit</button>
    </div>
  );
}
