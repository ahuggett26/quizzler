import React from "react";
import styles from "./PrimaryButton.module.css";

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function PrimaryButton(props: PrimaryButtonProps) {
  return <button className={styles.button} type="button" {...props} />;
}
