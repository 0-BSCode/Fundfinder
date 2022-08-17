import type { NextPage } from "next";
import { useContext, useState, useEffect } from "react";
import { CrowdfundContext } from "src/context/CrowdfundContext";
import Landing from "src/components/landing";
import HomeComponent from "src/components/home";
import { Goal } from "src/types/goal";

const Home: NextPage = () => {
  const { currentUser, goals, fundGoal, refundAllFunders } =
    useContext(CrowdfundContext);
  const [finalGoals, setFinalGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const checkForDeadline = async (goalList: Goal[]) => {
      goalList?.forEach(async (goal: Goal) => {
        console.log(`ID: ${goal.id}`);
        console.log(`DEADLINE PASSED: `, new Date() > goal.deadline);
        console.log(`IS ACTIVE: ${goal.isActive}`);

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
        {currentUser && currentUser.id ? (
          <>
            <HomeComponent />
            {goals &&
              goals
                .filter((goal: Goal) => goal.isActive)
                .map((goal: Goal) => (
                  <div key={goal.id}>
                    <h3>{goal.title}</h3>
                    <h6>{goal.description}</h6>
                    <p>{goal.details}</p>
                    <p>{goal.owner}</p>
                    <p>{goal.currentAmount}</p>
                    <p>{goal.maxAmount}</p>
                    <p>{goal.createdAt?.toString()}</p>
                    <p>{goal.deadline?.toString()}</p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        fundGoal(goal.id, "2");
                      }}
                    >
                      DONATE
                    </button>
                  </div>
                ))}
          </>
        ) : (
          <Landing />
        )}
      </main>
    </>
  );
};

export default Home;
