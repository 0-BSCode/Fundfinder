import React, { ReactElement, useContext, useEffect } from "react";
import { CrowdfundContext } from "src/context/CrowdfundContext";
import { Goal } from "src/types/goal";
import GoalCard from "../goal/Card";
import Search from "./searchBar";
import SetGoal from "./setGoal";
import styles from "./styles.module.css";
import { useRouter } from "next/router";

const HomeComponent = (): ReactElement => {
  const router = useRouter();
  const { goals } = useContext(CrowdfundContext);

  useEffect(() => {
    const cardWrapper = document.querySelector(`.${styles.home__goals}`);
    const cards = cardWrapper?.children;

    // if (cards) {
    //   for (var i = 0; i < cards.length; i++) {
    //     cards[i].addEventListener("click", () => {
    //       router.push(cards[i].id);
    //     });
    //   }
    // }
    console.log(cards);
  }, [goals]);

  return (
    <div className={styles.home}>
      <SetGoal />
      <Search />
      <section className={styles.home__goals}>
        {goals &&
          goals.map((goal: Goal) => <GoalCard goal={goal} key={goal.id} />)}
      </section>
    </div>
  );
};

export default HomeComponent;
