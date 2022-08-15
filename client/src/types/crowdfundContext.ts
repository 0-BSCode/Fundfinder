export interface CrowdfundContextType {
    connectWallet?: any;

    currentUser?: any;
    retrieveUser?: any;
    updateUser?: any;

    createGoal?: any;
    retrieveGoal?: any;
    fundGoal?: any;

    sendFunds?: any;

    isLoading?: boolean;
}