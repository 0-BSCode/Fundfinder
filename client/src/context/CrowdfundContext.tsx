import React, { useState, useEffect, ReactElement } from "react";
import { contractAbi, contractAddress } from "src/constants/contractDetails";
import { ethers } from "ethers";
import { User } from "src/types/user";

export const CrowdfundContext = React.createContext({});

export const CrowdfundProvider = ({
  children,
}: {
  children: ReactElement;
}): ReactElement => {
  const [ethereum, setEthereum] = useState<object>({});
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User>();

  const createEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
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
      if (!ethereum) alert("Please install MetaMask!");

      const accounts = await ethereum.request({ method: "request_accounts" });

      if (accounts.length) {
        setCurrentAccount(accounts[0]);

        retrieveUser(currentAccount);
      } else {
        console.log("No accounts found!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) alert("Please install MetaMask!");

      const accounts = await ethereum.request({ method: "request_accounts" });
      setCurrentAccount(accounts[0]);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const retrieveUser = async (accountId: string) => {
    if (ethereum) {
      const contract = createEthereumContract();
      let user;
      try {
        user = await contract.retrieveAccount(accountId);
      } catch (err) {
        await contract.createAccount(accountId);
        user = await contract.retrieveAccount(accountId);
      }

      console.log("USER");
      console.log(user);
    } else {
      console.log("No ethereum object found");
    }
  };

  useEffect(() => {
    console.log(window.ethereum);
    const initializeEthereum = async () => {
      await setEthereum(window.ethereum);
      checkForWalletConnection();
    };

    initializeEthereum();
  }, []);

  return (
    <CrowdfundContext.Provider
      value={{ connectWallet, currentAccount, retrieveUser }}
    >
      {children}
    </CrowdfundContext.Provider>
  );
};
