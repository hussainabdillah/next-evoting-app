import { ethers } from "ethers";
import { getVotingContract } from "@/utils/getContract";

export const vote = async (candidateId: number): Promise<void> => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  // Minta akses ke akun MetaMask
  await window.ethereum.request({ method: "eth_requestAccounts" });

  // Setup provider & signer
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // Dapatkan instance kontrak
  const contract = getVotingContract(signer);

  // Kirim vote ke blockchain
  const tx = await contract.vote(candidateId);
  await tx.wait(); // Tunggu konfirmasi transaksi
};
