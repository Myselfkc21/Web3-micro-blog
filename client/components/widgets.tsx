import React from "react";
import Image from "next/image";
import Link from "next/link";

interface TrendingTopic {
  category: string;
  title: string;
  tweetCount: string;
  image?: string;
}

interface WhoToFollow {
  name: string;
  handle: string;
  avatar: string;
}

export default function Widgets() {
  const trendingTopics: TrendingTopic[] = [
    {
      category: "Technology · Trending",
      title: "React",
      tweetCount: "95.4K Tweets",
      image: "/trending/tech.jpg",
    },
    {
      category: "Sports · Trending",
      title: "Champions League",
      tweetCount: "124K Tweets",
    },
    {
      category: "Entertainment · Trending",
      title: "New TV Series",
      tweetCount: "45.2K Tweets",
      image: "/trending/entertainment.jpg",
    },
    {
      category: "Politics · Trending",
      title: "Global Summit",
      tweetCount: "32.5K Tweets",
    },
    {
      category: "Business · Trending",
      title: "Cryptocurrency",
      tweetCount: "78.3K Tweets",
    },
  ];

  const whoToFollow: WhoToFollow[] = [
    {
      name: "Twitter",
      handle: "@Twitter",
      avatar: "/avatars/twitter.jpg",
    },
    {
      name: "Elon Musk",
      handle: "@elonmusk",
      avatar: "/avatars/elon.jpg",
    },
    {
      name: "Open AI",
      handle: "@OpenAI",
      avatar: "/avatars/openai.jpg",
    },
  ];

  return (
    <aside className="w-[350px] min-h-screen hidden lg:block pl-8 py-3 pr-4 overflow-y-auto sticky top-0">
      {/* Search bar */}
      <div className="mb-6 sticky top-0 pt-1 pb-3 bg-white/90 dark:bg-black/90 backdrop-blur-sm z-10">
        <div className="relative rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:ring-2 focus-within:ring-blue-500 transition-colors">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            className="w-full bg-transparent py-3 pl-10 pr-4 rounded-full outline-none placeholder-gray-500"
            placeholder="Search Twitter"
          />
        </div>
      </div>

      {/* What's happening section */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl mb-6">
        <h2 className="text-xl font-bold p-4">What's happening</h2>

        <div>
          {trendingTopics.map((topic, index) => (
            <div
              key={index}
              className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer flex justify-between items-start"
            >
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {topic.category}
                </p>
                <div className="flex flex-col">
                  <p className="text-[15px] font-bold">{topic.title}</p>
                  <p className="text-[13px] text-gray-500">
                    {topic.tweetCount.toLocaleString()} Tweets
                  </p>
                </div>
              </div>
              {topic.image && (
                <div className="w-16 h-16 rounded-xl overflow-hidden relative">
                  <div className="w-full h-full bg-gray-300 dark:bg-gray-600"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <Link
          href="/trends"
          className="text-blue-500 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block rounded-b-2xl"
        >
          Show more
        </Link>
      </div>

      {/* Who to follow section */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl mb-6">
        <h2 className="text-xl font-bold p-4">Who to follow</h2>

        <div>
          {whoToFollow.map((profile, index) => (
            <div
              key={index}
              className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden relative flex-shrink-0">
                  <div className="w-full h-full bg-gray-300 dark:bg-gray-600"></div>
                </div>
                <div className="ml-3">
                  <p className="font-bold leading-tight">{profile.name}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {profile.handle}
                  </p>
                </div>
              </div>
              <button className="bg-black dark:bg-white text-white dark:text-black font-bold py-1.5 px-4 rounded-full text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>

        <Link
          href="/connect"
          className="text-blue-500 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors block rounded-b-2xl"
        >
          Show more
        </Link>
      </div>

      {/* Footer links */}
      <div className="text-xs text-gray-500 dark:text-gray-400 px-4 mb-4">
        <div className="flex flex-wrap gap-x-2">
          <Link href="#" className="hover:underline">
            Terms of Service
          </Link>
          <Link href="#" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:underline">
            Cookie Policy
          </Link>
          <Link href="#" className="hover:underline">
            Accessibility
          </Link>
          <Link href="#" className="hover:underline">
            Ads info
          </Link>
          <Link href="#" className="hover:underline">
            More
          </Link>
        </div>
        <p className="mt-2">© 2023 Twitter Clone</p>
      </div>
    </aside>
  );
}
