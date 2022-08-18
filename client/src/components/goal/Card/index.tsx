import React, { ReactElement, useContext, useEffect } from "react";
import placeholderImg from "public/assets/images/image-restaurant.png";
import { CrowdfundContext } from "src/context/CrowdfundContext";
import { Goal } from "src/types/goal";
import styles from "./styles.module.css";
import parseWeiToText from "src/utils/parseWeiToText";
import Link from "next/link";

const GoalCard = ({ goal }: { goal: Goal }): ReactElement => {
  return (
    <Link href={`/goals/${goal.id}`}>
      <div className={styles.card}>
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
          <span className={styles.card__progress} />
        </div>
      </div>
    </Link>
  );
};

export default GoalCard;
