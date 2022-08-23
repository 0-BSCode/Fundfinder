import React, { ReactElement, useContext, useState, useEffect } from "react";
import { CrowdfundContext } from "src/context/CrowdfundContext";
import defaultPic from "public/assets/images/image-plane.png";
import parseTextForDateTime from "src/utils/parseTextForDateTime";
import styles from "./styles.module.css";
import { useRouter } from "next/router";

const GoalsCreate = (): ReactElement => {
  const router = useRouter();
  const { createGoal, goals } = useContext(CrowdfundContext);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");

  const submitGoal = async (e: any) => {
    e.preventDefault();
    const goalDate = parseTextForDateTime(deadline);

    await createGoal(title, description, details, "", amount, goalDate);
    router.push("/");
  };

  return (
    <main className={styles.create}>
      <h3 className={styles.create__title}>Set A Goal</h3>
      <div className={styles.create__wrapper}>
        <div className={styles.create__imgContainer}>
          <img
            className={styles.create__img}
            src={defaultPic.src}
            alt={"Placeholder picture"}
          />
        </div>
        <form className={styles.create__form}>
          <label className={styles.create__label} htmlFor={"title"}>
            Title
          </label>
          <input
            className={styles.create__input}
            type={"text"}
            placeholder={"What’s your goal?"}
            id={"title"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className={styles.create__label} htmlFor={"description"}>
            Description
          </label>
          <input
            className={styles.create__input}
            type={"text"}
            placeholder={"Describe what your goal is and why you need funds"}
            id={"description"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className={styles.create__label} htmlFor={"details"}>
            Details
          </label>
          <textarea
            id={"details"}
            className={`${styles.create__input} ${styles.create__textarea}`}
            placeholder={
              "Provide details for people to see when they view your goal"
            }
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <label className={styles.create__label} htmlFor={"amount"}>
            Amount
          </label>
          <input
            className={styles.create__input}
            type={"text"}
            placeholder={"How much do you need (in ether)?"}
            id={"amount"}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <label className={styles.create__label} htmlFor={"deadline"}>
            Deadline
          </label>
          <input
            className={styles.create__input}
            type={"text"}
            placeholder={"By when do you need these funds (mm/dd/yyyy)?"}
            id={"deadline"}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button className={styles.create__submit} onClick={submitGoal}>
            Set
          </button>
        </form>
      </div>
    </main>
  );
};

export default GoalsCreate;
