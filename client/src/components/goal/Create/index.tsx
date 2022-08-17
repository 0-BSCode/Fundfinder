import React, { ReactElement, useContext, useState, useEffect } from "react";
import { CrowdfundContext } from "src/context/CrowdfundContext";
import defaultPic from "public/assets/images/image-plane.png";
import { Goal } from "src/types/goal";
import parseTextForDateTime from "src/utils/parseTextForDateTime";

const GoalsCreate = (): ReactElement => {
  const { createGoal, goals } = useContext(CrowdfundContext);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");

  const submitGoal = async (e: any) => {
    e.preventDefault();
    const goalDate = parseTextForDateTime(deadline);

    console.log("Form Data");
    console.log(`Title: ${title}`);
    console.log(`Description: ${description}`);
    console.log(`Details: ${details}`);
    console.log(`Amount: ${amount}`);
    console.log(`Deadline: ${goalDate}`);

    console.log("CREATING");
    await createGoal(title, description, details, "", amount, goalDate);
    console.log("GOAL CREATED");
  };

  useEffect(() => {
    console.log("GOALS");
    console.log(goals);
  });
  return (
    <section>
      <h3>Set A Goal</h3>
      <div>
        <img src={defaultPic.src} alt={"Placeholder picture"} />
        <form>
          <label htmlFor={"title"}>Title</label>
          <input
            type={"text"}
            placeholder={"What’s your goal?"}
            id={"title"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor={"description"}>Description</label>
          <input
            type={"text"}
            placeholder={"Describe what your goal is and why you need funding"}
            id={"description"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor={"details"}>Details</label>
          <input
            type={"text"}
            placeholder={
              "Provide details for people to see when they view your goal"
            }
            id={"details"}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          <label htmlFor={"amount"}>Amount</label>
          <input
            type={"text"}
            placeholder={"How much do you need (in ether)?"}
            id={"amount"}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <label htmlFor={"deadline"}>Deadline</label>
          <input
            type={"text"}
            placeholder={
              "By when do you need these funds? Use the format mm/dd/yyyy"
            }
            id={"deadline"}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />

          <button onClick={submitGoal}>Set</button>
        </form>
      </div>
    </section>
  );
};

export default GoalsCreate;
