import React, { ReactElement, useState, useContext, useEffect } from "react";
import styles from "./styles.module.css";
import { CrowdfundContext } from "src/context/CrowdfundContext";

const GoalFundModal = ({
  goalId,
  isOpen,
  setIsOpen,
}: {
  goalId: number;
  isOpen: boolean;
  setIsOpen: Function;
}): ReactElement => {
  const { fundGoal } = useContext(CrowdfundContext);
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    const dialog = document.querySelector(
      `.${styles.fund}`
    ) as HTMLDialogElement;

    console.log("DIALOG");
    console.log(dialog);

    try {
      if (isOpen) dialog?.showModal();
      else dialog?.close();
    } catch (e) {
      dialog?.close();
    }
  }, [isOpen]);

  return (
    <dialog className={styles.fund}>
      <form className={styles.fund__form}>
        <label className={styles.fund__label} htmlFor={"amount"}>
          How much do you want to send <span>(in eth)</span>?
        </label>
        <input
          className={styles.fund__input}
          type={"text"}
          placeholder={"0"}
          id={"amount"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />{" "}
        <div className={styles.fund__buttons}>
          <button
            className={styles.fund__cancel}
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
          >
            Cancel
          </button>
          <button
            className={styles.fund__confirm}
            onClick={(e) => {
              e.preventDefault();
              fundGoal(goalId, amount);
            }}
          >
            Confirm
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default GoalFundModal;
