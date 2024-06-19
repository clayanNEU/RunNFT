const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiMDFiMjBlYS05NTgwLTRiNTctOTk0Ny0zNmQxZmE3YzljNmEiLCJlbWFpbCI6ImNsYXlhbmJ1c3lAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImRjZmY1NjJhODgzZjc0MzAxYzk0Iiwic2NvcGVkS2V5U2VjcmV0IjoiY2E2NjY5MGIyYzRkNWYwYzlmYjk2NmM3YWNhNWI3M2ExOWVjMGRhNjY0ZWNkODZkYzQzMjdiY2VlMDg2YzUxNyIsImlhdCI6MTcxODQyMDM2NX0.5RZrDwLGdkJtt247yntDeUtlHS51_W29kdR9vL60qlQ";

const pinFileToIPFS = async () => {
  const formData = new FormData();
  const src = "nike-run.JPG";

  const file = fs.createReadStream(src);
  formData.append("file", file);

  const pinataMetadata = JSON.stringify({
    name: "File name",
  });
  formData.append("pinataMetadata", pinataMetadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
  });
  formData.append("pinataOptions", pinataOptions);

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};
pinFileToIPFS();
