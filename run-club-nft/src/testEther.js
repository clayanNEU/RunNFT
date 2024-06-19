const { ethers } = require("ethers");

async function testProvider() {
  if (!window.ethereum) {
    console.error("MetaMask is not installed!");
    return;
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  console.log("Account:", await signer.getAddress());
}

testProvider().catch(console.error);
