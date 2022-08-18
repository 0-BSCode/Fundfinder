import React, { ReactElement, useContext } from "react";
import { Goal } from "src/types/goal";
import placeholderPic from "public/assets/images/image-restaurant.png";
import profilePic from "public/assets/images/profile-sample.png";
import styles from "./styles.module.css";
import trimAddress from "src/utils/trimAddress";
import { CrowdfundContext } from "src/context/CrowdfundContext";
import parseWeiToText from "src/utils/parseWeiToText";

const GoalView = ({ goal }: { goal: Goal }): ReactElement => {
  const { fundGoal } = useContext(CrowdfundContext);
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
          <p className={styles.goal__currAmount}>
            {parseWeiToText(goal.currentAmount)}
          </p>
          <p className={styles.goal__maxAmount}>
            {parseWeiToText(goal.maxAmount)}
          </p>
        </div>
        <div className={styles.goal__progress}>
          <p className={styles.goal__percent}>84% complete</p>
          <span className={styles.goal__progressBar} />
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
