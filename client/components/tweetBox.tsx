"use client";
import React, { useContext } from "react";
import Tweets from "./tweets";
import { client } from "../lib/client";
import { TwitterContext } from "@/app/context/TwitterContext";
import { usePathname } from "next/navigation";

export default function Feed() {
  const [tweetMessage, setTweetMessage] = React.useState("");
  const pathname = usePathname();
  const context = useContext(TwitterContext);
  const currentAccount = context?.currentAccount || "";
  const currentUser = context?.currentUser || {};
  const fetchTweets = context?.fetchTweets || (() => {});
  const postTweet = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!tweetMessage) return;

    try {
      const tweetId = `${Date.now()}_${currentAccount}`;

      const tweetDoc = {
        _type: "tweets",
        _id: tweetId,
        tweet: tweetMessage,
        timestamp: new Date().toISOString(),
        author: {
          _type: "reference",
          _ref: currentAccount,
        },
      };

      // console.log("Creating tweet document:", tweetDoc);
      await client.create(tweetDoc);
      // console.log("Tweet created successfully");

      // Update user's tweets array
      await client
        .patch(currentAccount)
        .setIfMissing({ tweets: [] })
        .insert("after", "tweets[-1]", [
          {
            _type: "reference",
            _ref: tweetId,
          },
        ])
        .commit();

      // console.log("User's tweets array updated");

      // Clear the input and refresh tweets
      setTweetMessage("");
      await fetchTweets();
    } catch (error) {
      console.error("Error posting tweet:", error);
    }
  };

  return (
    <main className="flex-1 ml-[275px]">
      <header className="h-14 border-b border-black/[.08] dark:border-white/[.145] flex items-center px-4 sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-10">
        <h1 className="text-xl font-bold">Home</h1>
      </header>
      <div className="p-4">
        <div className="flex items-start space-x-4 border-b border-black/[.08] dark:border-white/[.145] pb-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold overflow-hidden">
            <img
              src={currentUser?.profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <textarea
              value={tweetMessage}
              onChange={(e) => setTweetMessage(e.target.value)}
              className="w-full bg-transparent outline-none resize-none text-xl placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="What's happening?"
              rows={3}
            ></textarea>
            <div className="flex justify-end">
              <button
                type="submit"
                onClick={postTweet}
                className="bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white px-5 py-2 rounded-full font-bold transition-colors"
              >
                Tweet
              </button>
            </div>
          </div>
        </div>

        <Tweets />
      </div>
    </main>
  );
}
