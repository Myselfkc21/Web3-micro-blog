"use client";

import Sidebar from "@/components/Sidebar";
import Widgets from "@/components/widgets";
import Feed from "@/components/tweetBox";
import { useTwitterContext } from "./context/TwitterContext";
import Image from "next/image";

export default function HomePage() {
  const { appStatus, connectToWallet } = useTwitterContext();

  const app = (status = appStatus) => {
    switch (status) {
      case "connected":
        return userLoggedIn;
      case "not-connected":
        return noUserFound;
      case "loading":
        return loading;
      case "no-metamask":
        return noMetaMaskFound;
      case "error":
        return error;
      default:
        return loading;
    }
  };

  const userLoggedIn = (
    <div className="flex min-h-screen bg-white dark:bg-black">
      <div className="flex-1 flex max-w-[1400px] mx-auto">
        <Sidebar />
        <main className="flex-[2] border-x border-black/[.08] dark:border-white/[.145] min-h-screen">
          <Feed />
        </main>
        <Widgets />
      </div>
    </div>
  );

  const noUserFound = (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-[120px] h-[120px] flex items-center justify-center">
            <Image
              src="/metamask-fox.svg"
              alt="MetaMask Logo"
              width={120}
              height={120}
              className="animate-pulse"
              priority
            />
          </div>
        </div>
        <button
          onClick={connectToWallet}
          className="px-8 py-4 bg-[#F6851B] text-white rounded-full hover:bg-[#E2761B] transition-colors flex items-center space-x-2 shadow-lg hover:shadow-xl mx-auto"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <Image
              src="/metamask-fox.svg"
              alt="MetaMask"
              width={24}
              height={24}
              priority
            />
          </div>
          <span>Connect MetaMask</span>
        </button>
      </div>
    </div>
  );

  const noMetaMaskFound = (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="text-center p-8 max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <div className="flex justify-center mb-6">
          <div className="w-[80px] h-[80px] flex items-center justify-center">
            <Image
              src="/metamask-fox.svg"
              alt="MetaMask Logo"
              width={80}
              height={80}
              className="opacity-50"
              priority
            />
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4 text-[#F6851B]">
          MetaMask Required
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Please install MetaMask and set up a virtual ETH wallet in your
          browser to continue.
        </p>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-[#F6851B] text-white rounded-full hover:bg-[#E2761B] transition-colors"
        >
          Install MetaMask
        </a>
      </div>
    </div>
  );

  const error = (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
        <div className="flex justify-center mb-6">
          <svg
            className="w-16 h-16 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
        <p className="text-gray-600 dark:text-gray-300">
          An error occurred. Please try using a different browser.
        </p>
      </div>
    </div>
  );

  const loading = (
    <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
      <div className="text-center space-y-4">
        <div className="w-[80px] h-[80px] flex items-center justify-center mx-auto">
          <Image
            src="/metamask-fox.svg"
            alt="MetaMask Logo"
            width={80}
            height={80}
            className="animate-spin"
            priority
          />
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Connecting to MetaMask...
        </p>
      </div>
    </div>
  );

  return <div>{app(appStatus)}</div>;
}
