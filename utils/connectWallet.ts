// utils/connectWallet.ts
import { ethers } from "ethers";

export const connectWallet = async (): Promise<{
  provider: ethers.BrowserProvider;
  signer: ethers.Signer;
  address: string;
}> => {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { provider, signer, address };
};
