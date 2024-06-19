import React, { useState } from "react";
import { getWeb3, getContract } from "./web3";
import axios from "axios";

const MintNFT = () => {
  const [tokenURI, setTokenURI] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [message, setMessage] = useState("");

  const mintNFT = async () => {
    try {
      const provider = await getWeb3();
      const contract = await getContract(provider);
      const accounts = await provider.listAccounts();
      console.log("Minting NFT to account:", accounts[0]);
      await contract.mint(accounts[0], tokenURI);
      console.log("NFT minted successfully");
      setMessage("Mint successful!");
      fetchMetadata();
    } catch (error) {
      console.error("Error minting NFT:", error);
      setMessage("Mint failed!");
    }
  };

  const fetchMetadata = async () => {
    try {
      const response = await axios.get(tokenURI);
      const metadata = response.data;
      setImageURL(metadata.image);
    } catch (error) {
      console.error("Error fetching metadata:", error);
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
      {message && <p>{message}</p>}
      {imageURL && <img src={imageURL} alt="NFT" />}
    </div>
  );
};

export default MintNFT;
