const { ethers } = require("ethers");
const RunClubNFT = require("./contracts/RunClubNFT.json");

const deployContract = async () => {
  if (!window.ethereum) {
    console.error("MetaMask is not installed!");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("MetaMask account access granted");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    console.log("Account:", await signer.getAddress());

    console.log("Deploying the contract...");
    const factory = new ethers.ContractFactory(
      RunClubNFT.abi,
      RunClubNFT.bytecode,
      signer
    );
    const contract = await factory.deploy(await signer.getAddress());

    await contract.deploymentTransaction().wait();

    console.log("Contract deployed at address:", contract.target);
    return contract.target;
  } catch (error) {
    console.error("Error deploying contract:", error);
  }
};

module.exports = deployContract;
