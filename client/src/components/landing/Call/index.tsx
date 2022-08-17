import React, { ReactElement, useContext } from "react";
import { CrowdfundContext } from "src/context/CrowdfundContext";
import styles from "./styles.module.css";

const LandingCall = (): ReactElement => {
  const { connectWallet } = useContext(CrowdfundContext);
  return (
    <section className={styles.call}>
      <h4 className={styles.call__title}>What are you waiting for?</h4>
      <button
        onClick={(e) => {
          e.preventDefault();
          connectWallet();
        }}
        className={styles.call__btn}
      >
        Get started
      </button>
    </section>
  );
};

export default LandingCall;
