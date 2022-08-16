import React, { ReactElement } from "react";
import paymentLogo from "public/assets/images/icon-api.svg";
import goalLogo from "public/assets/images/icon-budgeting.svg";
import networkingLogo from "public/assets/images/icon-onboarding.svg";
import styles from "./styles.module.css";
import LandingDivider from "../landingDivider";
import LandingFeature from "./landingFeature";

const LandingFeatures = (): ReactElement => {
  return (
    <section className={styles.features}>
      <h3 className={styles.features__title}>What we make possible</h3>
      <div className={styles.features__container}>
        <LandingFeature
          logo={paymentLogo}
          feature={"Efficient payment processing"}
          description={
            "Leverage the power of blockchain technology to instantly send and receive funds from others with negligible transactional costs."
          }
        />
        <LandingFeature
          logo={goalLogo}
          feature={"Quick goal-setting"}
          description={
            "Quickly set up the details of the goals you have in mind with just a few clicks."
          }
        />
        <LandingFeature
          logo={networkingLogo}
          feature={"Peer-to-peer networking"}
          description={
            "Eliminate the need for large financial institutions to be an intermediary between you and the people you transfer funds with using blockchain’s p2p network."
          }
        />
      </div>
      <LandingDivider />
    </section>
  );
};

export default LandingFeatures;
