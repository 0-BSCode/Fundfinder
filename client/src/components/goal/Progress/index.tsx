import React, { ReactElement, useEffect } from "react";
import styles from "./styles.module.css";
import { ColorScheme } from "src/enums/colorScheme";

const GoalProgress = ({
  id,
  maxAmount,
  currAmount,
}: {
  id: number;
  maxAmount: number;
  currAmount: number;
}): ReactElement => {
  useEffect(() => {
    const slider = document.querySelector(
      `input[data-id="${id}"]`
    ) as HTMLInputElement;
    console.log("SLIDER");
    console.log(slider);
    const val = Math.floor((currAmount / maxAmount) * 100);

    slider.style.background = `linear-gradient(to right,
        ${ColorScheme.LIME_GREEN} 0%,
        ${ColorScheme.LIME_GREEN} ${val}%,
        ${ColorScheme.DARK_BLUE} ${val}%,
        ${ColorScheme.DARK_BLUE} 100%)`;
  }, [currAmount]);

  return (
    <div className={styles.goal__progress}>
      <p className={styles.goal__percent}>{`${Math.floor(
        (currAmount / maxAmount) * 100
      )}% complete `}</p>
      <input
        data-id={id}
        type={"range"}
        min={0}
        max={maxAmount}
        value={currAmount}
        className={styles.goal__progressBar}
      />
    </div>
  );
};

export default GoalProgress;
