export interface CrowdfundContextType {
    connectWallet?: any;

    currentUser?: any;
    retrieveUser?: any;
    updateUser?: any;
    retrieveUserGoals?: any;
    retrieveUserGoalsHelped?: any;

    goals?: any;
    createGoal?: any;
    retrieveGoal?: any;
    fundGoal?: any;
    retrieveGoalFunders?: any;

    refundAllFunders?: any;

    isLoading?: boolean;
}