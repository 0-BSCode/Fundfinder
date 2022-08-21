import React, { ReactElement, useEffect } from "react";
import styles from "./styles.module.css";
import { ColorScheme } from "src/enums/colorScheme";
import getTextFromDate from "src/utils/getTextFromDate";

const GoalProgress = ({
  id,
  maxAmount,
  currAmount,
  deadline,
}: {
  id: number;
  maxAmount: number;
  currAmount: number;
  deadline: Date;
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
    <div className={styles.progress}>
      <p className={styles.progress__percent}>{`${Math.floor(
        (currAmount / maxAmount) * 100
      )}% complete `}</p>
      <input
        data-id={id}
        type={"range"}
        min={0}
        max={maxAmount}
        value={currAmount}
        className={styles.progress__bar}
      />
      <p className={styles.progress__deadline}>{getTextFromDate(deadline)}</p>
    </div>
  );
};

export default GoalProgress;
