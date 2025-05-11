import { ethers } from "ethers";
import contractJson from "../contracts/Voting.json";

// Tipe agar ABI bisa dikenali (optional tapi rapi)
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;
const ABI = contractJson.abi;

// Untuk mengambil voting contract address
export const getVotingContract = (signerOrProvider: ethers.Signer | ethers.Provider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signerOrProvider);
};

// untuk mengambil hasil voting
export const getVotesForCandidate = async (candidateId: number): Promise<number> => {
  if (!window.ethereum) throw new Error("Metamask not found");

  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

  const votes: bigint = await contract.getVotes(candidateId);
  return Number(votes);
};
