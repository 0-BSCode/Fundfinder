import React, { useState, useEffect, ReactElement } from "react";
import { contractAbi, contractAddress } from "src/constants/contractDetails";
import { ethers } from "ethers";
import { User } from "src/types/user";
import parseResponseForUser from "src/utils/parseResponseForUser";
import { CrowdfundContextType } from "src/types/crowdfundContext";
import { ContractActions } from "src/enums/contractActions";
import parseErrorMessage from "src/utils/parseErrorMessage";

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
      if (ethereum && ethereum?.request) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length) {
          retrieveUser(accounts[0]);
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

  const createAccount = async (accountId: string) => {
    const contract = createEthereumContract();
    try {
      const txHash = await contract.createAccount(accountId);
      await txHash.wait();
    } catch (err) {
      console.error(parseErrorMessage(ContractActions.ACCOUNT_CREATE, err));
    }
  };

  const updateAccount = async (
    accountId: string,
    username: string,
    picture: string
  ) => {
    const contract = createEthereumContract();

    try {
      await contract.updateAccount(accountId, username, picture);
    } catch (err) {
      console.error(parseErrorMessage(ContractActions.ACCOUNT_UPDATE, err));
    }
  };

  const retrieveCurrentUser = async (accountId: string) => {
    if (typeof ethereum !== undefined) {
      let user: User = {};

      user = await retrieveUser(accountId);

      if (!user?.id?.length) {
        await createAccount(accountId);
        user = await retrieveUser(accountId);
      }
      console.log("USER");
      console.log(user);
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

  const createGoal = async () => {};

  const retrieveGoal = async () => {};

  const fundGoal = async () => {};

  const sendFunds = async () => {};

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
  }, [ethereum]);

  const value = { connectWallet, currentUser, retrieveUser };
  return (
    <CrowdfundContext.Provider value={value}>
      {children}
    </CrowdfundContext.Provider>
  );
};
