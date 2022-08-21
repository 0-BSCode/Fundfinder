import React, { ReactElement } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { CrowdfundContext } from "src/context/CrowdfundContext";
import GoalView from "src/components/goal/View";

const GoalPage: NextPage = (): ReactElement => {
  const { goals } = useContext(CrowdfundContext);
  const router = useRouter();
  const goalId = router?.query?.goalId;
  let id;

  if (goalId && goals) {
    id = parseInt(goalId[0]);
  } else {
    return <p>Loading...</p>;
  }

  return <GoalView goal={goals[id]} />;
};

export default GoalPage;
