// src/MintNFT.js
import React, { useState } from "react";
import { getWeb3, getContract } from "./web3";
import axios from "axios";
import Dropzone from "react-dropzone";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MintNFT.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const MintNFT = () => {
  const [file, setFile] = useState(null);
  const [traits, setTraits] = useState([{ trait_type: "", value: "" }]);
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [nftType, setNftType] = useState("");

  const handleFileDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setImagePreview(URL.createObjectURL(uploadedFile));
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
      setStatus("NFT minted successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      setStatus("Error minting NFT");
    }
  };

  const handleNftTypeChange = (event) => {
    setNftType(event.target.value);
    if (event.target.value === "achievement") {
      setTraits([{ trait_type: "Distance", value: "" }]);
    } else if (event.target.value === "membership") {
      setTraits([{ trait_type: "Member Name", value: "" }]);
    } else {
      setTraits([{ trait_type: "", value: "" }]);
    }
  };

  return (
    <div className="container">
      <h2 className="mt-5">Mint Run Club NFT</h2>
      <div className="mb-3">
        <label htmlFor="nftType">Select NFT Type:</label>
        <select
          id="nftType"
          className="form-select"
          value={nftType}
          onChange={handleNftTypeChange}
        >
          <option value="">Select Type</option>
          <option value="achievement">Achievement NFT</option>
          <option value="membership">Membership NFT</option>
        </select>
      </div>
      <div className="mb-3">
        <Dropzone onDrop={handleFileDrop}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <div className="upload-icon">
                <FontAwesomeIcon icon={faUpload} size="3x" />
                <p>Upload File</p>
              </div>
              {file ? (
                <p>{file.name}</p>
              ) : (
                <p>Drag 'n' drop a file here, or click to select a file</p>
              )}
            </div>
          )}
        </Dropzone>
        {imagePreview && (
          <div className="mt-3">
            <img src={imagePreview} alt="Preview" className="img-thumbnail" />
          </div>
        )}
      </div>
      <div className="mb-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="form-control mb-2"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="form-control mb-2"
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
              className="form-control mb-2"
            />
            <input
              type="text"
              value={trait.value}
              onChange={(e) =>
                handleTraitChange(index, "value", e.target.value)
              }
              placeholder="Trait Value"
              className="form-control mb-2"
            />
          </div>
        ))}
        <button onClick={handleAddTrait} className="btn btn-primary">
          Add Trait
        </button>
      </div>
      <div className="d-flex justify-content-center">
        <button onClick={mintNFT} className="btn btn-success">
          Mint NFT
        </button>
      </div>
      {status && <div className="alert alert-info mt-3">{status}</div>}
    </div>
  );
};

export default MintNFT;
