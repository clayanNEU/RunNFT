const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiMDFiMjBlYS05NTgwLTRiNTctOTk0Ny0zNmQxZmE3YzljNmEiLCJlbWFpbCI6ImNsYXlhbmJ1c3lAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImRjZmY1NjJhODgzZjc0MzAxYzk0Iiwic2NvcGVkS2V5U2VjcmV0IjoiY2E2NjY5MGIyYzRkNWYwYzlmYjk2NmM3YWNhNWI3M2ExOWVjMGRhNjY0ZWNkODZkYzQzMjdiY2VlMDg2YzUxNyIsImlhdCI6MTcxODQyMDM2NX0.5RZrDwLGdkJtt247yntDeUtlHS51_W29kdR9vL60qlQ";

const uploadJSONToPinata = async (filePath) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  const jsonData = fs.readFileSync(filePath, "utf-8");

  try {
    const response = await axios.post(url, jsonData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
    });
    console.log("Metadata uploaded to IPFS:", response.data);
  } catch (error) {
    console.error(
      "Error uploading metadata:",
      error.response ? error.response.data : error.message
    );
  }
};

uploadJSONToPinata("metadata/run-it-back.json");
