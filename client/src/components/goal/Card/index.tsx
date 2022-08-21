import React, { ReactElement } from "react";
import placeholderImg from "public/assets/images/image-restaurant.png";
import { Goal } from "src/types/goal";
import styles from "./styles.module.css";
import parseWeiToText from "src/utils/parseWeiToText";
import GoalProgress from "../Progress";
import { useRouter } from "next/router";

const GoalCard = ({ goal }: { goal: Goal }): ReactElement => {
  const router = useRouter();
  return (
    <div
      className={styles.card}
      onClick={(e) => router.push(`/goals/${goal.id}`)}
    >
      <div className={styles.card__imgContainer}>
        <img
          className={styles.card__img}
          src={placeholderImg.src}
          alt={"Goal Image"}
        />
      </div>
      <div className={styles.card__content}>
        <div className={styles.card__heading}>
          <p className={styles.card__title}>{goal.title}</p>
          <p className={styles.card__amount}>
            {parseWeiToText(goal.maxAmount)}
          </p>
        </div>
        <p className={styles.card__description}>{goal.description}</p>
        <GoalProgress
          id={goal.id}
          maxAmount={goal.maxAmount}
          currAmount={goal.currentAmount}
          deadline={goal.deadline}
        />{" "}
      </div>
    </div>
  );
};

export default GoalCard;
