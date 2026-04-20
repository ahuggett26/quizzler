import React from "react";
import { Outlet } from "react-router";
import styles from "./Root.module.css";

export default function Root() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Quizzler</h1>
        <hr className={styles["top-hr"]} />
      </header>
      <div className={styles.content}>
        <Outlet />
      </div>
      <footer className={styles.footer}>
        <hr />
        <p>By Andrew Huggett</p>
      </footer>
    </div>
  );
}
