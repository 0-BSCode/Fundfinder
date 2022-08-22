import React, { ReactElement, useState, useEffect, useContext } from "react";
import { CrowdfundContext } from "src/context/CrowdfundContext";
import { Goal } from "src/types/goal";
import placeholderPic from "public/assets/images/image-restaurant.png";
import profilePic from "public/assets/images/profile-sample.png";
import styles from "./styles.module.css";
import trimUsername from "src/utils/trimUsername";
import parseWeiToText from "src/utils/parseWeiToText";
import GoalProgress from "../Progress";
import GoalFundModal from "../FundModal";
import Link from "next/link";
import { User } from "src/types/user";

const GoalView = ({ goal }: { goal: Goal }): ReactElement => {
  const { retrieveUser } = useContext(CrowdfundContext);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [ownerName, setOwnerName] = useState<string>(goal.owner);

  useEffect(() => {
    const retrieveOwnerName = async () => {
      const owner: User = await retrieveUser(goal.owner);
      setOwnerName(owner.username);
    };

    retrieveOwnerName();
  }, [goal]);

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
          <Link href={`/users/${goal.owner}`}>
            <p className={styles.goal__owner}>{trimUsername(ownerName, 20)}</p>
          </Link>
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
