import React from "react";
import styles from "./FlashcardCore.module.css";

interface Props {
  children?: React.ReactNode;
}

export default function FlashcardCore({ children }: Props) {
  return <article className={styles.flashcard}>{children}</article>;
}
