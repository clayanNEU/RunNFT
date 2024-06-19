import React, { useState } from "react";
import { getWeb3, getContract } from "./web3";

const MintNFT = () => {
  const [tokenURI, setTokenURI] = useState("");

  const mintNFT = async () => {
    try {
      const provider = await getWeb3();
      const contract = await getContract(provider);
      const accounts = await provider.listAccounts();
      console.log("Minting NFT to account:", accounts[0]);
      await contract.mint(accounts[0], tokenURI);
      console.log("NFT minted successfully");
    } catch (error) {
      console.error("Error minting NFT:", error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={tokenURI}
        onChange={(e) => setTokenURI(e.target.value)}
        placeholder="Token URI"
      />
      <button onClick={mintNFT}>Mint NFT</button>
    </div>
  );
};

export default MintNFT;
