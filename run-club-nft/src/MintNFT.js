import React, { useState } from "react";
import { getWeb3, getContract } from "./web3";

const MintNFT = () => {
  const [tokenURI, setTokenURI] = useState("");

  const mintNFT = async () => {
    const web3 = await getWeb3();
    const accounts = await web3.listAccounts();
    const contract = await getContract(web3);
    await contract.mint(accounts[0], tokenURI);
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
