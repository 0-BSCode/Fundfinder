import React, { ReactElement } from "react";
import styles from "./styles.module.css";

const LandingCall = (): ReactElement => {
  return (
    <section className={styles.call}>
      <h4 className={styles.call__title}>What are you waiting for?</h4>
      <button className={styles.call__btn}>Get started</button>
    </section>
  );
};

export default LandingCall;
