"use client";

import React, { useContext, useEffect, useRef } from "react";
import { TwitterContext } from "@/app/context/TwitterContext";

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

export default function ProfileTweets({}) {
  const context = useContext(TwitterContext);
  const tweets = context?.tweets || [];
  const fetchUserTweets = context?.fetchUserTweets || (() => {});
  const hasFetchedRef = useRef(false);

  // Fetch tweets only once when component mounts
  useEffect(() => {
    if (!hasFetchedRef.current && fetchUserTweets) {
      fetchUserTweets();
      hasFetchedRef.current = true;
    }
  }, [fetchUserTweets]);

  // Function to format timestamp to relative time
  const formatTimeStamp = (timestamp: string) => {
    const date: any = new Date(timestamp);
    const now: any = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d`;
    }

    // For older tweets, show the date
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {tweets.length > 0 ? (
        tweets.map((tweet: Tweet, index: number) => (
          <div
            key={tweet._id || index}
            className="border-b border-black/[.08] dark:border-white/[.145] pb-4"
          >
            <div className="flex space-x-3">
              <div
                className={`w-10 h-10 flex-shrink-0 overflow-hidden relative ${
                  tweet.author.isProfileImageNft ? "hex" : "rounded-full"
                }`}
              >
                <img
                  src={tweet.author.profileImage}
                  alt={`${tweet.author.name}'s profile`}
                  className="w-full h-full object-cover"
                />
                {tweet.author.isProfileImageNft && (
                  <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-4 h-4 flex items-center justify-center border-2 border-white dark:border-black">
                    <span className="text-white text-xs transform scale-75">
                      ✓
                    </span>
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center">
                  <span className="font-bold mr-1">{tweet.author.name}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {`${tweet.author.walletAddress.slice(
                      0,
                      4
                    )}....${tweet.author.walletAddress.slice(-4)}`}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 mx-1">
                    ·
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {formatTimeStamp(tweet.timestamp)}
                  </span>
                </div>
                <p className="mt-1">{tweet.tweet}</p>
                <div className="flex justify-between mt-3 text-gray-500 dark:text-gray-400 max-w-md">
                  <button className="flex items-center hover:text-blue-500 transition-colors group">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="group-hover:scale-110 transition-transform"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                    <span className="ml-2">24</span>
                  </button>
                  <button className="flex items-center hover:text-green-500 transition-colors group">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="group-hover:scale-110 transition-transform"
                    >
                      <path d="M23 4v6h-6"></path>
                      <path d="M1 20v-6h6"></path>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
                      <path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    <span className="ml-2">5</span>
                  </button>
                  <button className="flex items-center hover:text-pink-500 transition-colors group">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="group-hover:scale-110 transition-transform"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span className="ml-2">34</span>
                  </button>
                  <button className="flex items-center hover:text-blue-500 transition-colors group">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="group-hover:scale-110 transition-transform"
                    >
                      <path d="M8 10l4 4 4-4"></path>
                      <path d="M21 15v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No tweets yet. Be the first to tweet!
        </div>
      )}

      <style jsx>{`
        .hex {
          display: grid;
          place-items: center;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          clip-path: polygon(
            0% 50%,
            25% 0%,
            75% 0%,
            100% 50%,
            75% 100%,
            25% 100%
          );
          -webkit-clip-path: polygon(
            0% 50%,
            25% 0%,
            75% 0%,
            100% 50%,
            75% 100%,
            25% 100%
          );
          -moz-clip-path: polygon(
            0% 50%,
            25% 0%,
            75% 0%,
            100% 50%,
            75% 100%,
            25% 100%
          );
        }

        .smallHex {
          display: grid;
          place-items: center;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          clip-path: polygon(
            0% 50%,
            25% 0%,
            75% 0%,
            100% 50%,
            75% 100%,
            25% 100%
          );
          -webkit-clip-path: polygon(
            0% 50%,
            25% 0%,
            75% 0%,
            100% 50%,
            75% 100%,
            25% 100%
          );
          -moz-clip-path: polygon(
            0% 50%,
            25% 0%,
            75% 0%,
            100% 50%,
            75% 100%,
            25% 100%
          );
        }
      `}</style>
    </div>
  );
}
