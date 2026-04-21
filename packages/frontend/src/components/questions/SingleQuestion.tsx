import { SingleQuestion as SingleQuestionProps } from "@quizzler/shared";
import Flashcard from "../cards/Flashcard";
import React from "react";
import styles from "./SingleQuestion.module.css";
import PrimaryButton from "../common/PrimaryButton";

export default function SingleQuestion(
  props: SingleQuestionProps & {
    disabled?: boolean;
    onSubmit: (answer: string) => void;
  },
) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  function submitAnswer() {
    if (props.disabled) {
      return;
    }
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
        disabled={props.disabled}
        onKeyDown={(e) => {
          if (props.disabled) {
            return;
          }
          if (e.key === "Enter") {
            submitAnswer();
          }
        }}
      />
      <PrimaryButton disabled={props.disabled} onClick={() => submitAnswer()}>
        Submit
      </PrimaryButton>
    </div>
  );
}
