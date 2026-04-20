import React from "react";
import styles from "./FlashcardCore.module.css";

interface Props {
  onClick?: () => void;
  children?: React.ReactNode;
}

export default function FlashcardCore({ onClick, children }: Props) {
  const className = onClick === undefined ? styles.flashcard : `${styles.flashcard} ${styles.clickable}`;
  return <article className={className} onClick={onClick}>{children}</article>;
}
