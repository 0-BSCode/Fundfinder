import React, { useState, useEffect, ReactElement } from "react";
import { contractAbi, contractAddress } from "src/constants/contractDetails";
import { ethers } from "ethers";
import { User } from "src/types/user";
import parseResponseForUser from "src/utils/parseResponseForUser";
import { CrowdfundContextType } from "src/types/crowdfundContext";
import { ContractActions } from "src/enums/contractActions";
import parseErrorMessage from "src/utils/parseErrorMessage";
import { Goal } from "src/types/goal";
import { ColorScheme } from "src/enums/colorScheme";
import parseResponseForGoal from "src/utils/parseResponseForGoal";

export const CrowdfundContext = React.createContext<CrowdfundContextType>(
  {} as CrowdfundContextType
);

export const CrowdfundProvider = ({
  children,
}: {
  children: ReactElement;
}): ReactElement => {
  const [ethereum, setEthereum] = useState<ethers.providers.ExternalProvider>();
  const [currentUser, setCurrentUser] = useState<User>();
  const [goals, setGoals] = useState<Goal[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(
      ethereum ? ethereum : ({} as ethers.providers.ExternalProvider)
    );
    const signer = provider.getSigner();
    const crowdfundContract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );

    return crowdfundContract;
  };

  const checkForWalletConnection = async () => {
    try {
      if (ethereum && ethereum?.request && !currentUser) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length) {
          retrieveCurrentUser(accounts[0]);
        } else {
          console.log("No accounts found!");
        }
      } else {
        if (typeof ethereum === undefined) alert("Please install MetaMask!");
      }
    } catch (err) {
      console.error(
        parseErrorMessage(ContractActions.WALLET_CHECK_CONNECTION, err)
      );
    }
  };

  const connectWallet = async () => {
    try {
      if (ethereum && ethereum?.request) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        retrieveCurrentUser(accounts[0]);
      } else {
        if (typeof ethereum === undefined) alert("Please install MetaMask!");
      }
    } catch (err) {
      console.error(parseErrorMessage(ContractActions.WALLET_CONNECT, err));
    }
  };

  const createUser = async (accountId: string) => {
    const contract = createEthereumContract();
    try {
      const txHash = await contract.createAccount(accountId);
      setIsLoading(true);
      await txHash.wait();
      setIsLoading(false);
    } catch (err) {
      console.error(parseErrorMessage(ContractActions.ACCOUNT_CREATE, err));
    }
  };

  const updateUser = async (
    accountId: string,
    username: string,
    picture: string
  ) => {
    const contract = createEthereumContract();

    try {
      const txHash = await contract.updateAccount(accountId, username, picture);
      setIsLoading(true);
      await txHash.wait();
      setIsLoading(false);
    } catch (err) {
      console.error(parseErrorMessage(ContractActions.ACCOUNT_UPDATE, err));
    }
  };

  const retrieveCurrentUser = async (accountId: string) => {
    if (typeof ethereum !== undefined) {
      let user: User = {};

      user = await retrieveUser(accountId);

      if (!user?.id?.length) {
        await createUser(accountId);
        user = await retrieveUser(accountId);
      }
      setCurrentUser(user);
    } else {
      console.error("No ethereum object found");
    }
  };

  const retrieveUser = async (accountId: string): Promise<User> => {
    const contract = createEthereumContract();
    let userInfo = [];
    try {
      userInfo = await contract.retrieveAccount(accountId);
    } catch (err) {
      console.error(parseErrorMessage(ContractActions.ACCOUNT_RETRIEVE, err));
    }

    let user: User = parseResponseForUser(userInfo);
    return user;
  };

  const retrieveUserGoals = async (accountId: string): Promise<Goal[]> => {
    const contract = createEthereumContract();
    let goals: Goal[] = [];

    try {
      let goalsCountRes = await contract
        .retrieveGoalsCount(accountId)
        .toString();
      let goalsCount = parseInt(goalsCountRes);

      for (let i = 0; i < goalsCount; i++) {
        let goalIdRes = await contract.retrieveGoalByIndex(accountId, i);
        let goalId = parseInt(goalIdRes.toString());

        let goal: Goal = await retrieveGoal(goalId);
        goals.push(goal);
      }
    } catch (err) {
      console.error(parseErrorMessage(ContractActions.ACCOUNT_GOALS, err));
    }

    return goals;
  };

  const retrieveUserGoalsHelped = async (
    accountId: string
  ): Promise<Goal[]> => {
    const contract = createEthereumContract();
    let goals: Goal[] = [];

    try {
      let goalsCountRes = await contract
        .retrieveGoalsHelpedCount(accountId)
        .toString();
      let goalsCount = parseInt(goalsCountRes);

      for (let i = 0; i < goalsCount; i++) {
        let goalIdRes = await contract.retrieveGoalHelpedByIndex(accountId, i);
        let goalId = parseInt(goalIdRes.toString());

        let goal: Goal = await retrieveGoal(goalId);
        goals.push(goal);
      }
    } catch (err) {
      console.error(parseErrorMessage(ContractActions.ACCOUNT_GOALS, err));
    }

    return goals;
  };

  const createGoal = async (
    title: string,
    description: string,
    details: string,
    picture: string,
    maxAmount: string,
    deadline: number
  ) => {
    let contract = createEthereumContract();

    try {
      const currTime = new Date().getTime();
      const currTimeSeconds = Math.floor(currTime / 1000);
      const amount = ethers.utils.parseEther(maxAmount);
      const txHash = await contract.createGoal(
        currentUser?.id,
        amount,
        currTimeSeconds + 100,
        title,
        description,
        details,
        picture
      );
      setIsLoading(true);
      await txHash.wait();
      setIsLoading(false);
    } catch (err) {
      console.error(parseErrorMessage(ContractActions.GOAL_CREATE, err));
    }
  };

  const retrieveGoal = async (goalId: number): Promise<Goal> => {
    const contract = createEthereumContract();
    let goalInfo = [];

    try {
      goalInfo = await contract.retrieveGoal(goalId);
    } catch (err) {
      console.error(parseErrorMessage(ContractActions.GOAL_RETRIEVE, err));
    }

    let goal: Goal = parseResponseForGoal(goalInfo);
    return goal;
  };

  const fundGoal = async (goalId: number, amount: string) => {
    const contract = createEthereumContract();

    try {
      const amt = ethers.utils.parseEther(amount);
      const txHash = await contract.fundGoal(goalId, {
        from: currentUser?.id,
        value: amt,
      });

      console.log("HASH");
      console.log(txHash);
      setIsLoading(true);
      await txHash.wait();
      setIsLoading(false);
    } catch (err) {
      console.error(parseErrorMessage(ContractActions.GOAL_FUND, err));
    }
  };

  const retrieveGoalFunders = async (goalId: number): Promise<User[]> => {
    const contract = createEthereumContract();
    let users: User[] = [];

    try {
      let fundersCountRes = await contract
        .retrieveFunderAddressesCount(goalId)
        .toString();
      let fundersCount = parseInt(fundersCountRes);

      for (let i = 0; i < fundersCount; i++) {
        let accountId = await contract.retrieveFunderAddressByIndex(goalId, i);

        let user: User = await retrieveUser(accountId);
        users.push(user);
      }
    } catch (err) {
      console.error(parseErrorMessage(ContractActions.GOAL_FUNDERS, err));
    }

    return users;
  };

  const retrieveAllGoalsCount = async (): Promise<number> => {
    const contract = createEthereumContract();
    let goalsCount: number = -1;
    try {
      let goalsCountRes = await contract.goalNumber();
      goalsCount = parseInt(goalsCountRes.toString());
    } catch (err) {
      parseErrorMessage(ContractActions.GOAL_COUNT, err);
    }

    return goalsCount;
  };

  const retrieveAllGoals = async (): Promise<Goal[]> => {
    const goals: Goal[] = [];

    try {
      const goalsCount = await retrieveAllGoalsCount();
      for (let i = 0; i < goalsCount; i++) {
        const goal = await retrieveGoal(i);
        console.log("GOAL");
        console.log(goal);
        goals.push(goal);
      }
    } catch (err) {
      parseErrorMessage(ContractActions.GOAL_RETRIEVE, err);
    }

    return goals;
  };

  const refundAllFunders = async (goalId: number) => {
    const contract = createEthereumContract();

    try {
      const time = new Date().getTime();
      const timeSeconds = Math.floor(time / 1000);
      console.log("TRYING REFUND");
      const txHash = await contract.refundFunders(goalId, timeSeconds);

      console.log("REFUND CONFIRMED");
      setIsLoading(true);
      await txHash.wait();
      setIsLoading(false);
    } catch (err) {
      console.error(parseErrorMessage(ContractActions.ACCOUNT_REFUND, err));
    }
  };

  useEffect(() => {
    setEthereum(window.ethereum);
  }, []);

  useEffect(() => {
    checkForWalletConnection();

    window?.ethereum?.on(
      "accountsChanged",
      async function (accounts: string[]) {
        if (ethereum) {
          retrieveCurrentUser(accounts[0]);
        }
      }
    );
  });

  useEffect(() => {
    if (document) {
      const root = document.querySelector(":root") as HTMLElement;
      const rootStyle = root.style;
      if (currentUser?.id) {
        rootStyle.setProperty("--main-bg-color", ColorScheme.LIGHT_GRAY);
        rootStyle.setProperty(
          "--attribution-font-color",
          ColorScheme.DARK_BLUE
        );
      } else {
        rootStyle.setProperty("--main-bg-color", ColorScheme.DARK_BLUE);
        rootStyle.setProperty(
          "--attribution-font-color",
          ColorScheme.LIGHT_GRAY
        );
      }
    }

    const getAllGoals = async () => {
      if (currentUser) {
        setGoals(await retrieveAllGoals());
      }
    };

    getAllGoals();
  }, [ethereum, currentUser]);

  const value = {
    connectWallet,
    currentUser,
    retrieveUser,
    updateUser,
    retrieveUserGoals,
    retrieveUserGoalsHelped,
    goals,
    createGoal,
    retrieveGoal,
    fundGoal,
    retrieveGoalFunders,
    refundAllFunders,
    isLoading,
  };

  return (
    <CrowdfundContext.Provider value={value}>
      {children}
    </CrowdfundContext.Provider>
  );
};
