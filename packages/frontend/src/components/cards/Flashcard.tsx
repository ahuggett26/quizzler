import { ReactNode } from "react";
import FlashcardCore from "./FlashcardCore";
import { Flashcard as FlashcardProps } from "@quizzler/shared";

type Props = {
  onClick?: () => void
} & FlashcardProps;

export default function Flashcard(props: Props) {
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

  return <FlashcardCore onClick={props.onClick}>{content}</FlashcardCore>;
}
