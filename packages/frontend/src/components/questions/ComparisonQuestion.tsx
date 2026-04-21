import { ComparisonQuestion as ComparisonQuestionProps } from "@quizzler/shared";
import Flashcard from "../cards/Flashcard";
import styles from "./ComparisonQuestion.module.css";

type Props = ComparisonQuestionProps & {
  disabled: boolean;
  onSubmit: (answerId: number) => void;
};

export default function ComparisonQuestion(props: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.options}>
        {props.options.map((option) => {
          // If question is disabled, don't pass in any onClick to flashcard,
          // so it knows to render UI without pointer etc.
          const onFlashcardClick = props.disabled ? undefined : () => props.onSubmit(option.id)
          return (
            <Flashcard key={option.id} {...option} onClick={onFlashcardClick} />
        )})}
      </div>
      <h3 className={styles.question}>{props.question}</h3>
    </div>
  );
}
