export interface CrowdfundContextType {
    connectWallet?: any;

    currentUser?: any;
    retrieveUser?: any;
    updateUser?: any;
    retrieveUserGoals?: any;
    retrieveUserGoalsHelped?: any;

    createGoal?: any;
    retrieveGoal?: any;
    fundGoal?: any;
    retrieveGoalFunders?: any;

    sendFunds?: any;

    isLoading?: boolean;
}