import axios from "axios";

// Get API keys with validation
const key = "332337ce3ccc595d53b3";
const secret =
  "8a1b848c3737a7c58698070068a342c85289c825eff9238fce9ab4c8c89fea75";

// Check if API keys are available
if (!key || !secret) {
  console.error(
    "Pinata API keys are missing. Please check your environment variables."
  );
}

export const pinJsonToIPFS = async (json) => {
  try {
    const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

    const response = await axios.post(url, json, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    });

    // Check if response is valid
    if (response.status !== 200) {
      throw new Error(`Failed to pin JSON to IPFS: ${response.statusText}`);
    }

    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error pinning JSON to IPFS:", error);
    throw error; // Re-throw the error for handling by the caller
  }
};

export const pinFileToIPFS = async (file, pinataMetadata) => {
  try {
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    // Create FormData
    const formData = new FormData();
    formData.append("file", file);

    if (pinataMetadata) {
      formData.append("pinataMetadata", JSON.stringify(pinataMetadata));
    }

    const response = await axios.post(url, formData, {
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    });

    // Check if response is valid
    if (response.status !== 200) {
      throw new Error(`Failed to pin file to IPFS: ${response.statusText}`);
    }

    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error pinning file to IPFS:", error);
    throw error; // Re-throw the error for handling by the caller
  }
};

// Utility function to check if Pinata API keys are valid
export const testPinataConnection = async () => {
  try {
    const url = "https://api.pinata.cloud/data/testAuthentication";

    const response = await axios.get(url, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    });

    return response.status === 200;
  } catch (error) {
    console.error("Pinata authentication failed:", error);
    return false;
  }
};
