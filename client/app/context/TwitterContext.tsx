"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { client } from "../../lib/client";

interface Tweet {
  _id: string;
  tweet: string;
  timestamp: string;
  author: {
    name: string;
    walletAddress: string;
    profileImage: string;
    isProfileImageNft: boolean;
  };
}

interface TwitterContextType {
  appStatus: string;
  connectToWallet: () => void;
  currentAccount: string;
  tweets: Tweet[];
  fetchTweets: () => Promise<void>;
  fetchUserTweets: (userWalletAddress?: string) => Promise<void>;
  setAppStatus: React.Dispatch<React.SetStateAction<string>>;
  getNftProfileImage: (imageUri: string, isNft: boolean) => Promise<string>;
  currentUser: any;
  getCurrentUserDetails: (userAccount?: string) => Promise<void>;
}

export const TwitterContext = createContext<TwitterContextType | undefined>(
  undefined
);

export const TwitterProvider = ({ children }: { children: ReactNode }) => {
  const [appStatus, setAppStatus] = useState<string>("not-connected");
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<any>({});
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const router = useRouter();

  const connectToWallet = async () => {
    try {
      setAppStatus("loading");

      if (typeof window !== "undefined" && window.ethereum) {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (addressArray.length > 0) {
          setAppStatus("connected");
          setCurrentAccount(addressArray[0]);
          await createUserAccount(addressArray[0]);
        } else {
          router.push("/");
          setAppStatus("not-connected");
        }
      } else {
        setAppStatus("no-metamask");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      router.push("/");
      setAppStatus("error");
    }
  };

  const createUserAccount = async (userAddress = currentAccount) => {
    if (!window.ethereum) return setAppStatus("noMetaMask");
    try {
      // console.log("Creating user account for address:", userAddress);
      // console.log("Sanity client config:", {
      //   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      //   dataset: client.config().dataset,
      //   useCdn: client.config().useCdn,
      // });

      const userDoc = {
        _type: "user",
        _id: userAddress,
        name: "Unnamed",
        isProfileImageNft: false,
        profileImage:
          "https://about.twitter.com/content/dam/about-twitter/en/brand-toolkit/brand-download-img-1.jpg.twimg.1920.jpg",
        walletAddress: userAddress,
      };

      // console.log("Attempting to create user document:", userDoc);
      const result = await client.createIfNotExists(userDoc);
      // console.log("Sanity create result:", result);

      setAppStatus("connected");
    } catch (error) {
      console.error("Error creating user:", error);
      console.error("Error details:", {
        message: (error as Error).message,
        stack: (error as Error).stack,
      });
      router.push("/");
      setAppStatus("error");
    }
  };

  const fetchTweets = async () => {
    try {
      // Optimize the query to fetch fewer tweets initially
      const query = `
        *[_type == "tweets"]{
          _id,
          tweet,
          timestamp,
          "author": author->{
            name,
            walletAddress,
            profileImage,
            isProfileImageNft
          }
        }|order(timestamp desc)[0...10]
      `;

      // Increase timeout to 15 seconds
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        const sanityResponse = await client.fetch<Tweet[]>(
          query,
          {},
          {
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        // Process tweets in batches to avoid overwhelming the browser
        const batchSize = 5;
        setTweets([]);

        for (let i = 0; i < sanityResponse.length; i += batchSize) {
          const batch = sanityResponse.slice(i, i + batchSize);
          const processedBatch = await Promise.all(
            batch.map(async (item) => {
              try {
                const profileImageUrl = await getNftProfileImage(
                  item.author.profileImage,
                  item.author.isProfileImageNft
                );

                return {
                  ...item,
                  author: {
                    ...item.author,
                    profileImage: profileImageUrl,
                  },
                };
              } catch (itemError) {
                console.error("Error processing tweet item:", itemError);
                return null;
              }
            })
          );

          // Filter out any failed items and update tweets
          const validTweets = processedBatch.filter(
            (tweet): tweet is Tweet => tweet !== null
          );
          setTweets((prev) => [...prev, ...validTweets]);

          // Add a small delay between batches
          if (i + batchSize < sanityResponse.length) {
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
        }
      } catch (fetchError: unknown) {
        if (fetchError instanceof Error && fetchError.name === "AbortError") {
          console.warn("Tweet fetch timed out, using partial results");
          // Don't throw, just continue with what we have
        } else {
          throw fetchError;
        }
      }
    } catch (error) {
      console.error("Error fetching tweets:", error);
      // Keep existing tweets instead of clearing them on error
      // setTweets([]);
    }
  };

  const getCurrentUserDetails = async (userAccount = currentAccount) => {
    if (appStatus !== "connected") return;

    const query = `
      *[_type == "user" && _id == "${userAccount}"]{
        "tweets": tweets[]->{timestamp, tweet}|order(timestamp desc),
        name,
        profileImage,
        isProfileImageNft,
        coverImage,
        walletAddress
      }
    `;
    const response = await client.fetch(query);

    if (response && response.length > 0) {
      const profileImageUri = await getNftProfileImage(
        response[0].profileImage,
        response[0].isProfileImageNft
      );

      setCurrentUser({
        tweets: response[0].tweets,
        name: response[0].name,
        profileImage: profileImageUri,
        walletAddress: response[0].walletAddress,
        coverImage: response[0].coverImage,
        isProfileImageNft: response[0].isProfileImageNft,
      });
    }
  };

  const getNftProfileImage = async (
    imageUri: string,
    isNft: boolean
  ): Promise<string> => {
    if (isNft) {
      return `https://gateway.pinata.cloud/ipfs/${imageUri}`;
    }
    return imageUri;
  };

  const [isFetching, setIsFetching] = useState(false);

  const fetchUserTweets = useCallback(
    async (userWalletAddress = currentAccount) => {
      // Prevent duplicate fetches
      if (isFetching) return;

      setIsFetching(true);

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
        const formattedTweets = sanityResponse.map(
          (item: {
            tweet: string;
            timestamp: string;
            author: {
              name: string;
              walletAddress: string;
              profileImage: string;
              isProfileImageNft: boolean;
            };
          }) => ({
            tweet: item.tweet,
            timestamp: item.timestamp,
            author: {
              name: item.author.name,
              walletAddress: item.author.walletAddress,
              profileImage: item.author.profileImage,
              isProfileImageNft: item.author.isProfileImageNft,
            },
          })
        );

        // Single state update
        setTweets(formattedTweets);
      } catch (error) {
        console.error("Error fetching tweets:", error);
      } finally {
        setIsFetching(false);
      }
    },
    [isFetching, currentAccount]
  );

  return (
    <TwitterContext.Provider
      value={{
        appStatus,
        connectToWallet,
        currentAccount,
        tweets,
        fetchTweets,
        fetchUserTweets,
        setAppStatus,
        getNftProfileImage,
        currentUser,
        getCurrentUserDetails,
      }}
    >
      {children}
    </TwitterContext.Provider>
  );
};

export function useTwitterContext() {
  const context = useContext(TwitterContext);
  if (context === undefined) {
    throw new Error("useTwitterContext must be used within a TwitterProvider");
  }
  return context;
}
