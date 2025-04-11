import React, { useState } from "react";
import InitialState from "./InitialState";
import { pinFileToIPFS } from "../../lib/pinata";
import { client } from "../../lib/client";
import { contractAddress, contractABI } from "@/lib/constants";
import { useTwitterContext } from "../../app/context/TwitterContext";
import { ethers } from "ethers";

let metamask;

if (typeof window !== "undefined") {
  metamask = window.ethereum;
}

const getEthereumContract = async () => {
  if (!metamask) return;

  try {
    // Request account access
    await metamask.request({ method: "eth_requestAccounts" });

    // Create a provider using ethers v6
    const provider = new ethers.BrowserProvider(metamask);
    const signer = await provider.getSigner();

    // Create contract instance
    const transactionContract = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    return transactionContract;
  } catch (error) {
    console.error("Error getting Ethereum contract:", error);
    return null;
  }
};

const ProfileImageMinter = () => {
  const [status, setStatus] = useState("initial");
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { currentAccount } = useTwitterContext();

  const handleMint = async () => {
    if (!profileImage || !name || !description || !currentAccount) {
      console.error("Missing required data:", {
        profileImage: !!profileImage,
        name: !!name,
        description: !!description,
        currentAccount: !!currentAccount,
      });
      return;
    }

    setStatus("loading");

    try {
      // Upload image to IPFS
      const ipfsImageHash = await pinFileToIPFS(profileImage, {
        name: `${name} - ${description}`,
      });
      console.log("Image uploaded to IPFS:", ipfsImageHash);

      // Update user profile in Sanity
      await client
        .patch(currentAccount)
        .set({ profileImage: ipfsImageHash })
        .set({ isProfileImageNft: true })
        .commit();

      console.log("User profile updated in Sanity");

      // Create metadata for NFT
      const imageMetaData = {
        name: name,
        description: description,
        image: `ipfs://${ipfsImageHash}`,
      };

      // Get contract instance
      const contract = await getEthereumContract();
      if (!contract) {
        throw new Error("Failed to get Ethereum contract");
      }

      // Mint NFT
      try {
        const transaction = await contract.mint(
          currentAccount,
          `ipfs://${ipfsImageHash}`
        );
        await transaction.wait(); // Wait for transaction to be mined
        setStatus("success");
      } catch (error) {
        console.error("Error in minting transaction:", error);
        throw error;
      }

      setStatus("success");
    } catch (error) {
      console.error("Error minting profile image:", error);
      setStatus("error");
    }
  };

  const modalChildren = (modalStatus = status) => {
    switch (modalStatus) {
      case "initial":
        return (
          <InitialState
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            mint={handleMint}
          />
        );

      case "loading":
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-xl font-bold mb-4">Minting in Progress</h2>
            <p className="mb-4">
              Please wait while we mint your profile image...
            </p>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        );

      case "success":
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-xl font-bold mb-4 text-green-500">Success!</h2>
            <p className="mb-4">
              Your profile image has been minted successfully.
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setStatus("initial")}
            >
              Mint Another
            </button>
          </div>
        );

      case "error":
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-xl font-bold mb-4 text-red-500">Error</h2>
            <p className="mb-4">
              There was a problem minting your profile image.
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setStatus("initial")}
            >
              Try Again
            </button>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-xl font-bold mb-4">Unknown Status</h2>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setStatus("initial")}
            >
              Start Over
            </button>
          </div>
        );
    }
  };

  return <div>{modalChildren()}</div>;
};

export default ProfileImageMinter;
