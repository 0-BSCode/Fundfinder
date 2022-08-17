import React, { ReactElement, useContext } from "react";
import { CrowdfundContext } from "src/context/CrowdfundContext";
import Search from "./searchBar";
import SetGoal from "./setGoal";
import styles from "./styles.module.css";

const HomeComponent = (): ReactElement => {
  const { goals } = useContext(CrowdfundContext);
  return (
    <div className={styles.home}>
      <SetGoal />
      <Search />
      <section className={styles.home__goals}>{/* Goals here */}</section>
    </div>
  );
};

export default HomeComponent;
