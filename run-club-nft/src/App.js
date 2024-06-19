import React from "react";
import MintNFT from "./MintNFT";
import deployContract from "./deploy";

const App = () => {
  const deploy = async () => {
    const address = await deployContract();
    console.log("Deployed contract address:", address);
  };

  return (
    <div className="App">
      <h1>Run Club NFT Minting</h1>
      <button onClick={deploy}>Deploy Contract</button>
      <MintNFT />
    </div>
  );
};

export default App;
