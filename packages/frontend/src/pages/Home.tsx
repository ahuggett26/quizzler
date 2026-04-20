import React from "react";
import { useNavigate } from "react-router";
import styles from "./Home.module.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <button onClick={() => navigate("/geography")}>
        Quick Geography Quiz
      </button>
    </div>
  );
}
