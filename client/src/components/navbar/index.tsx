import React, { ReactElement, useContext } from "react";
import { CrowdfundContext } from "src/context/CrowdfundContext";
import logo from "public/assets/images/fundfinder-logo.svg";
import profile from "public/assets/images/profile-sample.png";
import styles from "./styles.module.css";
import Link from "next/link";

const Navbar = (): ReactElement => {
  const { connectWallet, currentUser } = useContext(CrowdfundContext);

  return (
    <nav className={styles.nav}>
      <Link href={"/"}>
        <img className={styles.nav__logo} src={logo.src} alt={"Fundfinder"} />
      </Link>
      {currentUser?.id ? (
        <Link href={`/users/${currentUser.id}`}>
          <button className={styles.nav__profile}>
            <img
              className={styles.nav__profilePic}
              src={profile.src}
              alt={"Profile picture"}
            />
          </button>
        </Link>
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
