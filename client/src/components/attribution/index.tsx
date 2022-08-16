import React, { ReactElement } from "react";
import styles from "./styles.module.css";

const Attribution = (): ReactElement => {
  return (
    <footer className={styles.footer}>
      <p className={styles.footer__attribution}>
        made by{" "}
        <a
          className={styles.footer__attributionLink}
          href={"https://github.com/0-BSCode"}
          target={"_blank"}
          rel={"noreferrer"}
        >
          0-BSCode
        </a>
      </p>
    </footer>
  );
};

export default Attribution;
