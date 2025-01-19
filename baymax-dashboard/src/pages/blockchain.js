import { ethers } from "ethers";
import { contractAddress, contractABI } from "./contractConfig";

export const connectToContract = async () => {
  if (window.ethereum) {
    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Create a provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum); // Adjusted for ethers v6
      const signer = await provider.getSigner();

      // Connect to the contract
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      console.log("Connected to contract:", contract);

      return contract;
    } catch (error) {
      console.error("Error connecting to contract:", error);
      throw error;
    }
  } else {
    throw new Error("Ethereum wallet not found. Install MetaMask.");
  }
};
