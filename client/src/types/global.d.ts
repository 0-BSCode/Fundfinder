import { ethers } from 'ethers';
export {};

type ExtensionForProvider = {
  on: (event: string, callback: (...params: any) => void) => void;
};

type EthersProvider = ethers.providers.ExternalProvider & ExtensionForProvider;

declare global {
  interface Window {
    ethereum?: EthersProvider;
  }
}