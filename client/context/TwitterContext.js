"use client";
import { createContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { client } from "../lib/client";
export const TwitterContext = createContext();

export const TwitterProvider = ({ children }) => {
  const [appStatus, setAppStatus] = useState("loading");
  const [currentAccount, setCurrentAccount] = useState("");
  const [tweets, setTweets] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return;
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        //connected
        setAppStatus("connected");
        setCurrentAccount(addressArray[0]);
        createUserAccount(addressArray[0]);
      } else {
        // not connected
        setAppStatus("not-connected");
      }
    } catch (error) {
      router.push("/");
      console.log(error);
    }
  };

  ///initiates Metamask wallet connection
  const connectToWallet = async () => {
    if (!window.ethereum) return setAppStatus("no-metamask");
    try {
      setAppStatus("loading");
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (addressArray.length > 0) {
        //connected
        setAppStatus("connected");
        setCurrentAccount(addressArray[0]);
        createUserAccount(addressArray[0]);
      } else {
        // not connected
        setAppStatus("not-connected");
      }
    } catch (error) {
      router.push("/");
      console.log(error);
    }
  };

  /**
   *
   *  @params{String} useWalletAddress
   *
   *
   */
  const createUserAccount = async (userWalletAddress = currentAccount) => {
    if (!window.ethereum) return setAppStatus("no-metamask");
    // console.log("userWalletAddress:" + userWalletAddress);
    try {
      const userDoc = {
        _type: "users",
        _id: userWalletAddress,
        userName: "Unkown",
        walletAddress: userWalletAddress,
        profileImage:
          "https://i.pinimg.com/736x/79/05/21/790521279c2a7c335ddd9f13448124a6.jpg",
        isProfileNFT: false,
      };
      await client.createIfNotExists(userDoc);
    } catch (error) {
      router.push("/");
      console.log(error);
    }
  };

  // Use useCallback to prevent recreation of this function on every render
  const fetchTweets = useCallback(async () => {
    // Prevent duplicate fetches
    if (isFetching) return;

    setIsFetching(true);
    // console.log("Fetching tweets... (only once)");

    try {
      const query = `*[_type == "tweets"]{
        "author": author->{
          name,
          walletAddress,
          profileImage,
          isProfileImageNft
        },
        tweet,
        timestamp
      }|order(timestamp desc)`;

      const sanityResponse = await client.fetch(query);

      // Process all tweets at once instead of updating state in a loop
      const formattedTweets = sanityResponse.map((item) => ({
        tweet: item.tweet,
        timestamp: item.timestamp,
        author: {
          name: item.author.name,
          walletAddress: item.author.walletAddress,
          profileImage: item.author.profileImage,
          isProfileImageNft: item.author.isProfileImageNft,
        },
      }));

      // Single state update
      setTweets(formattedTweets);
    } catch (error) {
      console.error("Error fetching tweets:", error);
    } finally {
      setIsFetching(false);
    }
  }, [isFetching]); // Only depends on isFetching

  const fetchUserTweets = useCallback(
    async (userWalletAddress = currentAccount) => {
      // Prevent duplicate fetches
      if (isFetching) return;

      setIsFetching(true);
      // console.log("Fetching tweets... (only once)");

      try {
        const query = `*[_type == "tweets" && author._ref == "${userWalletAddress}"]{
        "author": author->{
          name,
          walletAddress,
          profileImage,
          isProfileImageNft
        },
        tweet,
        timestamp
      }|order(timestamp desc)`;

        const sanityResponse = await client.fetch(query);

        // Process all tweets at once instead of updating state in a loop
        const formattedTweets = sanityResponse.map((item) => ({
          tweet: item.tweet,
          timestamp: item.timestamp,
          author: {
            name: item.author.name,
            walletAddress: item.author.walletAddress,
            profileImage: item.author.profileImage,
            isProfileImageNft: item.author.isProfileImageNft,
          },
        }));

        // Single state update
        setTweets(formattedTweets);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      } finally {
        setIsFetching(false);
      }
    },
    [isFetching]
  ); // Only depends on isFetching

  // Use useCallback to prevent recreation of this function on every render
  const getCurrentUserDetails = useCallback(
    async (userAccount = currentAccount) => {
      if (appStatus !== "connected" || !userAccount) return;

      try {
        const query = `
        *[_type == "user" && _id == "${userAccount}"]{
        "tweets":tweets[]->{timestamp, tweet}|order(timestamp desc),
        name,
        profileImage,
        isProfileImageNft,
        coverImage,
        walletAddress
        }
      `;
        const response = await client.fetch(query);

        if (response && response.length > 0) {
          setCurrentUser({
            tweets: response[0].tweets,
            name: response[0].name,
            profileImage: response[0].profileImage,
            isProfileImageNft: response[0].isProfileImageNft,
            walletAddress: response[0].walletAddress,
            coverImage: response[0].coverImage,
          });
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    },
    [appStatus, currentAccount]
  ); // Only depend on status and account

  return (
    <TwitterContext.Provider
      value={{
        appStatus,
        currentAccount,
        connectToWallet,
        fetchTweets,
        tweets,
        currentUser,
        getCurrentUserDetails,
        fetchUserTweets,
      }}
    >
      {children}
    </TwitterContext.Provider>
  );
};
