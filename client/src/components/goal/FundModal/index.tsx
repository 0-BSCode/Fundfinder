import React, { ReactElement, useState, useContext } from "react";
import styles from "./styles.module.css";
import { CrowdfundContext } from "src/context/CrowdfundContext";

const GoalFundModal = ({
  goalId,
  isOpen,
}: {
  goalId: number;
  isOpen: boolean;
}): ReactElement => {
  const { fundGoal } = useContext(CrowdfundContext);
  const [amount, setAmount] = useState<string>("");

  return (
    <dialog id="favDialog" open={isOpen}>
      <form method="dialog">
        <label className={styles.fund__label} htmlFor={"amount"}>
          Amount
        </label>
        <input
          className={styles.fund__input}
          type={"text"}
          placeholder={"Amount to send (in eth)"}
          id={"amount"}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />{" "}
        <div>
          <button value="cancel">Cancel</button>
          <button
            id="confirmBtn"
            value="default"
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
