"use client";

import { useEffect } from "react";
import ProfileTweets from "./ProfileTweets";
import { useTwitterContext } from "@/app/context/TwitterContext";

export default function ProfileHeader() {
  const { currentUser, getCurrentUserDetails, currentAccount } = useTwitterContext();
  
  // Set a default image if none is provided
  const profileImage = currentUser?.profileImage || 
    "https://about.twitter.com/content/dam/about-twitter/en/brand-toolkit/brand-download-img-1.jpg.twimg.1920.jpg";
  
  const coverImage = currentUser?.coverImage || 
    "https://i.pinimg.com/736x/33/8e/de/338ede5f9f949b9c4cc6c1c0c15c6a00.jpg";
  
  const isProfileNFT = currentUser?.isProfileImageNft || false;
  const userName = currentUser?.name || "User";

  useEffect(() => {
    if (currentAccount) {
      getCurrentUserDetails(currentAccount);
    }
  }, [currentAccount, getCurrentUserDetails]);

  return (
    <div className="relative">
      <div className="h-48 bg-gray-300 dark:bg-gray-700 overflow-hidden">
        <img
          src={coverImage}
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <div className="relative flex justify-between">
          <div className="absolute -top-16">
            <div
              className={`w-32 h-32 border-4 border-white dark:border-[#15202b] bg-gray-200 dark:bg-gray-600 overflow-hidden ${
                isProfileNFT ? "hex-profile" : "rounded-full"
              }`}
            >
              <img
                src={profileImage}
                alt="Profile picture"
                className="w-full h-full object-cover"
              />

              {isProfileNFT && (
                <div className="absolute bottom-1 right-1 bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center border-2 border-white dark:border-[#15202b]">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </div>
          </div>

          <div className="ml-auto">
            <button className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 font-bold hover:bg-gray-100 dark:hover:bg-white/[.06] transition-colors">
              Edit profile
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold">{userName}</h2>
          {currentAccount && (
            <p className="text-gray-500 dark:text-gray-400">
              @{currentAccount.slice(0, 5)}...{currentAccount.slice(-4)}
            </p>
          )}

          <p className="mt-4">Bio goes here</p>

          <div className="flex gap-4 mt-4 text-gray-500 dark:text-gray-400">
            <span>
              <span className="text-black dark:text-white font-bold">0</span>{" "}
              Following
            </span>
            <span>
              <span className="text-black dark:text-white font-bold">0</span>{" "}
              Followers
            </span>
          </div>
        </div>

        <div className="flex mt-4 border-b border-gray-200 dark:border-gray-700">
          <button className="px-4 py-4 font-bold hover:bg-gray-100 dark:hover:bg-white/[.06] transition-colors border-b-4 border-blue-500">
            Tweets
          </button>
          <button className="px-4 py-4 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[.06] transition-colors">
            Replies
          </button>
          <button className="px-4 py-4 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[.06] transition-colors">
            Media
          </button>
          <button className="px-4 py-4 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/[.06] transition-colors">
            Likes
          </button>
        </div>
        <ProfileTweets />
      </div>

      <style jsx>{`
        .hex-profile {
          clip-path: polygon(
            50% 0%,
            100% 25%,
            100% 75%,
            50% 100%,
            0% 75%,
            0% 25%
          );
        }
      `}</style>
    </div>
  );
}
