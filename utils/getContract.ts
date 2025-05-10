import { ethers } from "ethers";
import contractJson from "../contracts/Voting.json";

// Tipe agar ABI bisa dikenali (optional tapi rapi)
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
const ABI = contractJson.abi;

export const getVotingContract = (signerOrProvider: ethers.Signer | ethers.Provider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signerOrProvider);
};
