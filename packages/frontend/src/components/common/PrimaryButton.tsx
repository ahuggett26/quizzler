import React from "react";
import styles from "./PrimaryButton.module.css";

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function PrimaryButton({
  className = "",
  type = "button",
  ...props
}: PrimaryButtonProps) {
  const mergedClassName = `${styles.button} ${className}`.trim();
  return <button className={mergedClassName} type={type} {...props} />;
}
