import React, { useState } from "react";
import { getWeb3, getContract } from "./web3";
import axios from "axios";
import Dropzone from "react-dropzone";
import "bootstrap/dist/css/bootstrap.min.css";

const MintNFT = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [traits, setTraits] = useState([{ trait_type: "", value: "" }]);
  const [status, setStatus] = useState("");

  const handleFileDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const handleAddTrait = () => {
    setTraits([...traits, { trait_type: "", value: "" }]);
  };

  const handleTraitChange = (index, field, value) => {
    const newTraits = traits.slice();
    newTraits[index][field] = value;
    setTraits(newTraits);
  };

  const handleFileUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("pinataMetadata", JSON.stringify({ name: file.name }));
    formData.append("pinataOptions", JSON.stringify({ cidVersion: 0 }));

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
          },
        }
      );
      return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading file:", error);
      setStatus("Error uploading file to IPFS");
    }
  };

  const handleMetadataUpload = async (imageURI) => {
    const metadata = {
      name: name,
      description: description,
      image: imageURI,
      attributes: traits,
    };

    try {
      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
          },
        }
      );
      return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
      console.error("Error uploading metadata:", error);
      setStatus("Error uploading metadata to IPFS");
    }
  };

  const mintNFT = async () => {
    try {
      setStatus("Uploading file to IPFS...");
      const imageURI = await handleFileUpload();

      if (!imageURI) {
        setStatus("Failed to upload image");
        return;
      }

      setStatus("Uploading metadata to IPFS...");
      const metadataURI = await handleMetadataUpload(imageURI);

      if (!metadataURI) {
        setStatus("Failed to upload metadata");
        return;
      }

      setStatus("Minting NFT...");
      const web3 = await getWeb3();
      const signer = await web3.getSigner();
      const address = await signer.getAddress();
      console.log("Account:", address);
      const contract = await getContract(web3);

      await contract.mint(address, metadataURI);
      setStatus("NFT minted successfully");
    } catch (error) {
      console.error("Error minting NFT:", error);
      setStatus("Error minting NFT");
    }
  };

  return (
    <div className="container">
      <h2>Mint Run Club NFT</h2>
      <div className="mb-3">
        <Dropzone onDrop={handleFileDrop}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              {file ? (
                <p>{file.name}</p>
              ) : (
                <p>Drag 'n' drop a file here, or click to select a file</p>
              )}
            </div>
          )}
        </Dropzone>
      </div>
      <div className="mb-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="NFT Name"
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="NFT Description"
          className="form-control"
        />
      </div>
      <div className="mb-3">
        {traits.map((trait, index) => (
          <div key={index} className="mb-2">
            <input
              type="text"
              value={trait.trait_type}
              onChange={(e) =>
                handleTraitChange(index, "trait_type", e.target.value)
              }
              placeholder="Trait Type"
              className="form-control"
            />
            <input
              type="text"
              value={trait.value}
              onChange={(e) =>
                handleTraitChange(index, "value", e.target.value)
              }
              placeholder="Trait Value"
              className="form-control"
            />
          </div>
        ))}
        <button onClick={handleAddTrait} className="btn btn-primary">
          Add Trait
        </button>
      </div>
      <button onClick={mintNFT} className="btn btn-success">
        Mint NFT
      </button>
      <p>{status}</p>
    </div>
  );
};

export default MintNFT;
