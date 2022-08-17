import React, { ReactElement } from "react";
import LandingDivider from "../Divider";
import styles from "./styles.module.css";

const LandingHero = (): ReactElement => {
  return (
    <section className={styles.hero}>
      <h1 className={styles.hero__title}>
        The future of <b>crowdfunding</b>
      </h1>
      <p className={styles.hero__description}>
        Take your fundraiser to the blockchain! This place is your one-stop-shop
        for getting the funds you need to turn your imagination into reality.
      </p>
      <LandingDivider />
    </section>
  );
};

export default LandingHero;
