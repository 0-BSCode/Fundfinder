import React, { ReactElement, useContext } from "react";
import { CrowdfundContext } from "src/context/CrowdfundContext";
import logo from "public/assets/images/fundfinder-logo.svg";
import profile from "public/assets/images/profile-sample.png";
import styles from "./styles.module.css";

const Navbar = (): ReactElement => {
  const { connectWallet, currentUser } = useContext(CrowdfundContext);

  return (
    <nav className={styles.nav}>
      <img className={styles.nav__logo} src={logo.src} alt={"Fundfinder"} />
      {currentUser?.id ? (
        <button className={styles.nav__profile}>
          <img
            className={styles.nav__profilePic}
            src={profile.src}
            alt={"Profile picture"}
          />
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            connectWallet();
          }}
          className={styles.nav__btn}
        >
          Get started
        </button>
      )}
    </nav>
  );
};

export default Navbar;
