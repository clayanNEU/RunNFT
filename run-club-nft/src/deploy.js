const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const RunClubNFT = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./contracts/RunClubNFT.json"))
);

const deployContract = async () => {
  if (!window.ethereum) {
    console.error("MetaMask is not installed!");
    return;
  }

  // Request account access if needed
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  console.log("Deploying the contract...");

  const factory = new ethers.ContractFactory(
    RunClubNFT.abi,
    RunClubNFT.bytecode,
    signer
  );
  const contract = await factory.deploy();

  console.log("Waiting for the contract to be mined...");
  await contract.deployTransaction.wait();

  console.log("Contract deployed at:", contract.address);
  return contract.address;
};

deployContract().catch((error) => {
  console.error("Error deploying contract:", error);
});
