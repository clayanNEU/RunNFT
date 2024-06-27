import { ethers } from "ethers";
import RunClubNFT from "./contracts/RunClubNFT.json";

const getWeb3 = async () => {
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider;
};

const getContract = async (provider) => {
  // const network = await provider.getNetwork();
  const deployedNetwork = RunClubNFT.networks["base-mainnet"];
  if (!deployedNetwork) {
    throw new Error(`No deployed network found for Base Mainnet`);
  }
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(
    deployedNetwork.address,
    RunClubNFT.abi,
    signer
  );
  return contract;
};

export { getWeb3, getContract };
