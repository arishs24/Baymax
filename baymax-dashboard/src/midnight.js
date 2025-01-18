import { Midnight } from "@midnight/sdk";

export const midnight = new Midnight({
  network: "testnet", // Change to 'mainnet' when ready for production
  apiKey: "YOUR_API_KEY", // Add your API key here
});

export const connectWallet = async () => {
  try {
    const wallet = await midnight.connectWallet();
    console.log("Wallet connected:", wallet);
    return wallet;
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
};
