import PrimaryButton from "../common/PrimaryButton";
import styles from "./AnswerDisplay.module.css";

type Props = {
  isCorrect: boolean;
  details: string;
  onNext: () => void;
};

export default function AnswerDisplay({ isCorrect, details, onNext }: Props) {
  return (
    <section className={styles.container}>
      <h3 className={isCorrect ? styles.correct : styles.wrong}>
        {isCorrect ? "Correct" : "Wrong"}
      </h3>
      <p className={styles.details}>{details}</p>
      <PrimaryButton type="button" onClick={onNext}>
        Next question
      </PrimaryButton>
    </section>
  );
}
