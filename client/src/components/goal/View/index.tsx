import React, { ReactElement, useContext, useEffect } from "react";
import { Goal } from "src/types/goal";
import placeholderPic from "public/assets/images/image-restaurant.png";
import profilePic from "public/assets/images/profile-sample.png";
import styles from "./styles.module.css";
import trimAddress from "src/utils/trimAddress";
import { CrowdfundContext } from "src/context/CrowdfundContext";
import parseWeiToText from "src/utils/parseWeiToText";
import { ColorScheme } from "src/enums/colorScheme";

const GoalView = ({ goal }: { goal: Goal }): ReactElement => {
  const { fundGoal } = useContext(CrowdfundContext);

  useEffect(() => {
    const slider = document.querySelector(
      `.${styles.goal__progressBar}`
    ) as HTMLInputElement;

    if (slider && goal.currentAmount && goal.maxAmount) {
      console.log(typeof goal.maxAmount);
      console.log(typeof slider.value.valueOf());
      const val = Math.floor((goal.currentAmount / goal.maxAmount) * 100);
      console.log(`Val: ${val}`);
      slider.style.background = `linear-gradient(to right,
                               ${ColorScheme.LIME_GREEN} 0%,
                               ${ColorScheme.LIME_GREEN} ${val}%,
                               ${ColorScheme.DARK_BLUE} ${val}%,
                               ${ColorScheme.DARK_BLUE} 100%)`;
    }
  }, [goal.currentAmount]);

  return (
    <main className={styles.goal}>
      <img
        src={placeholderPic.src}
        alt={"Placeholder"}
        className={styles.goal__img}
      />
      <section className={styles.goal__content}>
        <h1 className={styles.goal__title}>{goal.title}</h1>
        <div className={styles.goal__heading}>
          <img
            src={profilePic.src}
            alt={"Profile picture"}
            className={styles.goal__profPic}
          />
          <p className={styles.goal__owner}>{trimAddress(goal.owner)}</p>
          <p className={styles.goal__description}>{goal.description}</p>
        </div>
        <p className={styles.goal__details}>{goal.details}</p>
        <div className={styles.goal__divider} />
        <div className={styles.goal__amount}>
          <p className={styles.goal__maxAmount}>
            {parseWeiToText(goal.maxAmount)}
          </p>
          <p className={styles.goal__currAmount}>
            {`${parseWeiToText(goal.currentAmount)} raised`}
          </p>
        </div>
        <div className={styles.goal__progress}>
          <p className={styles.goal__percent}>{`${
            (goal.currentAmount / goal.maxAmount) * 100
          }% complete `}</p>
          <input
            type={"range"}
            min={0}
            max={goal.maxAmount}
            value={goal.currentAmount}
            className={styles.goal__progressBar}
          />{" "}
        </div>
        <button
          className={styles.goal__fund}
          onClick={(e) => {
            e.preventDefault();
            fundGoal(goal.id, "3");
          }}
        >
          Fund
        </button>
      </section>
    </main>
  );
};

export default GoalView;
