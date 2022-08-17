import React from "react";
import Link from "next/link";
import styles from "./styles.module.css";

const SetGoal = () => {
  return (
    <Link href={"/goals/create"}>
      <button className={styles.setGoal}>Set a goal</button>
    </Link>
  );
};

export default SetGoal;
