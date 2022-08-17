import React, { ReactElement } from "react";
import { NextPage } from "next";
import GoalsCreate from "src/components/goal/Create";

const GoalsCreatePage: NextPage = (): ReactElement => {
  return <GoalsCreate />;
};

export default GoalsCreatePage;
