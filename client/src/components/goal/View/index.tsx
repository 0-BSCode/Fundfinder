import React, { ReactElement, useState } from "react";
import { Goal } from "src/types/goal";
import placeholderPic from "public/assets/images/image-restaurant.png";
import profilePic from "public/assets/images/profile-sample.png";
import styles from "./styles.module.css";
import trimAddress from "src/utils/trimAddress";
import parseWeiToText from "src/utils/parseWeiToText";
import GoalProgress from "../Progress";
import GoalFundModal from "../FundModal";

const GoalView = ({ goal }: { goal: Goal }): ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
        <GoalProgress
          id={goal.id}
          maxAmount={goal.maxAmount}
          currAmount={goal.currentAmount}
          deadline={goal.deadline}
        />
        <button
          className={styles.goal__fund}
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(true);
          }}
        >
          Fund
        </button>
        <GoalFundModal goalId={goal.id} isOpen={isOpen} setIsOpen={setIsOpen} />
      </section>
    </main>
  );
};

export default GoalView;
