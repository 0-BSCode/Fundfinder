import React, { ReactElement } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";
import { CrowdfundContext } from "src/context/CrowdfundContext";
import GoalView from "src/components/goal/View";

const GoalPage: NextPage = (): ReactElement => {
  const { goals } = useContext(CrowdfundContext);
  const router = useRouter();
  const goalId = parseInt(router?.query?.goalId[0]);

  console.log("Router query");
  console.log(goalId);

  return <GoalView goal={goals[goalId]} />;
};

export default GoalPage;
