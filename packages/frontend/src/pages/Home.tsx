import React from "react";
import { useNavigate } from "react-router";
import styles from "./Home.module.css";
import PrimaryButton from "../components/common/PrimaryButton";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <PrimaryButton onClick={() => navigate("/geography-daily")}>
        Daily Geography Quiz
      </PrimaryButton>
      <PrimaryButton onClick={() => navigate("/geography-practice")}>
        Geography Practice Quiz
      </PrimaryButton>
    </div>
  );
}
