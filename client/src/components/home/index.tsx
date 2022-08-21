import React, { ReactElement, useContext, useEffect, useState } from "react";
import { CrowdfundContext } from "src/context/CrowdfundContext";
import { Goal } from "src/types/goal";
import GoalCard from "../goal/Card";
import SetGoal from "./setGoal";
import styles from "./styles.module.css";

const HomeComponent = (): ReactElement => {
  const { goals } = useContext(CrowdfundContext);
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>(goals);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    console.log("GOALS from home");
    console.log(goals);

    if (goals) {
      let finalGoals = goals.filter((goal: Goal) => goal.isActive === true);

      if (searchText.length) {
        finalGoals = finalGoals.filter((goal: Goal) =>
          goal.title.toUpperCase().includes(searchText.toUpperCase())
        );
      }

      setFilteredGoals(finalGoals);
    }
  }, [goals, searchText]);

  return (
    <div className={styles.home}>
      <SetGoal />
      <input
        className={styles.home__search}
        type={"text"}
        placeholder={"Looking for something specific?"}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <h3 className={styles.home__activeGoals}>Active Goals</h3>
      <section className={styles.home__goals}>
        {filteredGoals?.map((goal: Goal) => (
          <GoalCard goal={goal} key={goal.id} />
        ))}
      </section>
    </div>
  );
};

export default HomeComponent;
