import { ComparisonQuestion as ComparisonQuestionProps } from "@quizzler/shared";
import Flashcard from "../cards/Flashcard";
import styles from "./ComparisonQuestion.module.css";

type Props = ComparisonQuestionProps & {
  onSubmit: (answerId: number) => void;
};

export default function ComparisonQuestion(props: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.options}>
        {props.options.map((option) => (
          <Flashcard key={option.id} {...option} onClick={() => props.onSubmit(option.id)} />
        ))}
      </div>
      <h3 className={styles.question}>{props.question}</h3>
    </div>
  );
}
