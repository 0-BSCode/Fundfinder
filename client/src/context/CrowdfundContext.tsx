import React, { useState, useEffect, ReactElement } from "react";
import { contractAbi, contractAddress } from "src/constants/contractDetails";
import { ethers } from "ethers";
import { User } from "src/types/user";
import parseResponseForUser from "src/utils/parseResponseForUser";
import { CrowdfundContextType } from "src/types/crowdfundContext";

export const CrowdfundContext = React.createContext<CrowdfundContextType>(
  {} as CrowdfundContextType
);

export const CrowdfundProvider = ({
  children,
}: {
  children: ReactElement;
}): ReactElement => {
  const [ethereum, setEthereum] = useState<ethers.providers.ExternalProvider>();
  const [currentAccount, setCurrentUser] = useState<User>();

  const createEthereumContract = () => {
    console.log("ETHEREUM CREATE");
    console.log(ethereum);
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

        console.log(typeof accounts[0]);
        if (accounts.length) {
          setCurrentUser(await retrieveAccount(accounts[0]));
        } else {
          console.log("No accounts found!");
        }
      } else {
        if (typeof ethereum === undefined) alert("Please install MetaMask!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async () => {
    // * Doesn't retrieve user. Instead, it reloads page,
    // * which lets checkForWalletConnection retrieve user

    try {
      if (ethereum && ethereum?.request) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        setCurrentUser(await retrieveAccount(accounts[0]));
      } else {
        if (typeof ethereum === undefined) alert("Please install MetaMask!");
        else alert("Smthg's wrong");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createAccount = async (accountId: string): Promise<boolean> => {
    const contract = createEthereumContract();
    let res = false;
    try {
      const txHash = await contract.createAccount(accountId);
      await txHash.wait();
      res = true;
    } catch (err) {
      console.log(err);
    }

    return res;
  };

  const updateAccount = async (
    accountId: string,
    username: string,
    picture: string
  ) => {
    const contract = createEthereumContract();

    try {
      await contract.updateAccount(accountId, username, picture);
      setCurrentUser(await retrieveAccount(accountId));
    } catch (err) {
      console.log(err);
    }
  };

  const retrieveUser = async (accountId: string): Promise<User> => {
    let user: User = {};
    if (typeof ethereum !== undefined) {
      const contract = createEthereumContract();
      let userInfo;
      try {
        userInfo = await contract.retrieveAccount(accountId);
      } catch (err) {
        try {
          if (await createAccount(accountId)) {
            userInfo = await contract.retrieveAccount(accountId);
          } else {
            throw new Error("User refused account creation.");
          }
        } catch (err) {
          alert("User refused to create account. Refresh to try again.");
        }
      }

      user = parseResponseForUser(userInfo);
    } else {
      console.log("No ethereum object found");
    }

    return user;
  };

  const retrieveAccount = async (accountId: string): Promise<User> => {
    const contract = createEthereumContract();
    let userInfo = [];
    try {
      userInfo = await contract.retrieveAccount(accountId);
    } catch (err) {
      console.log("Error on account retrieval");
      console.log(err);
    }

    let user: User = parseResponseForUser(userInfo);
    return user;
  };

  const createGoal = async () => {};

  useEffect(() => {
    setEthereum(window.ethereum);
  }, []);

  useEffect(() => {
    checkForWalletConnection();
    window?.ethereum?.on(
      "accountsChanged",
      async function (accounts: string[]) {
        if (ethereum) {
          setCurrentUser(await retrieveUser(accounts[0]));
        }
      }
    );
  }, [ethereum]);

  const value = { connectWallet, currentAccount, retrieveAccount };
  return (
    <CrowdfundContext.Provider value={value}>
      {children}
    </CrowdfundContext.Provider>
  );
};
