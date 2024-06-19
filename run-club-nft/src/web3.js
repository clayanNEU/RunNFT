const { ethers } = require("ethers");
const RunClubNFT = require("./contracts/RunClubNFT.json");

const getWeb3 = async () => {
  if (window.ethereum) {
    const web3 = new ethers.providers.Web3Provider(window.ethereum);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      return web3;
    } catch (error) {
      console.error("User denied account access");
      throw error;
    }
  } else {
    console.error(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
    throw new Error(
      "Non-Ethereum browser detected. You should consider trying MetaMask!"
    );
  }
};

const getContract = async (web3) => {
  const networkId = (await web3.getNetwork()).chainId;
  const deployedNetwork = RunClubNFT.networks[networkId];
  const contract = new ethers.Contract(
    deployedNetwork.address,
    RunClubNFT.abi,
    web3.getSigner()
  );
  return contract;
};

module.exports = { getWeb3, getContract };
