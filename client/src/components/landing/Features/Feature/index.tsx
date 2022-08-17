import React, { ReactElement } from "react";
import styles from "./styles.module.css";

const LandingFeature = ({
  logo,
  feature,
  description,
}: {
  logo: any;
  feature: string;
  description: string;
}): ReactElement => {
  return (
    <div className={styles.feature}>
      <img className={styles.feature__logo} src={logo.src} alt={"Feature"} />
      <h5 className={styles.feature__title}>{feature}</h5>
      <p className={styles.feature__description}>{description}</p>
    </div>
  );
};

export default LandingFeature;
