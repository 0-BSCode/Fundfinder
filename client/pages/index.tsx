import type { NextPage } from "next";
import { useContext, useState, useEffect } from "react";
import { CrowdfundContext } from "src/context/CrowdfundContext";
import Landing from "src/components/landing";
import HomeComponent from "src/components/home";
import { Goal } from "src/types/goal";
import GoalCard from "src/components/goal/Card";

const Home: NextPage = () => {
  const { currentUser, goals, fundGoal, refundAllFunders } =
    useContext(CrowdfundContext);
  const [finalGoals, setFinalGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const checkForDeadline = async (goalList: Goal[]) => {
      goalList?.forEach(async (goal: Goal) => {
        if (goal.deadline) {
          const deadlinePassed = new Date() > goal.deadline;
          const goalIsActive = goal.isActive;
          if (deadlinePassed && goalIsActive) {
            await refundAllFunders(goal.id);
          }
        }
      });
    };

    checkForDeadline(goals);
  }, [goals]);

  return (
    <>
      <main>
        {currentUser && currentUser.id ? <HomeComponent /> : <Landing />}
      </main>
    </>
  );
};

export default Home;

/*
- Check refund functionality
- Refresh goals whenever one is updated
*/
