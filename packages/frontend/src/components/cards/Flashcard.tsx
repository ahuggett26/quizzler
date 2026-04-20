import { ReactNode } from "react";
import FlashcardCore from "./FlashcardCore";
import { Flashcard as FlashcardProps } from "@quizzler/shared";

export default function Flashcard(props: FlashcardProps) {
  let content: ReactNode;

  if (props.type === "image") {
    content = (
      <>
        <img src={props.image} alt="Flashcard content" />
        {props.text && <p>{props.text}</p>}
      </>
    );
  } else {
    content = <h2>{props.text}</h2>;
  }

  return <FlashcardCore>{content}</FlashcardCore>;
}
