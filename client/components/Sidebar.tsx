"use client";
import React, { useContext, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TwitterContext } from "@/app/context/TwitterContext";

interface SidebarItem {
  label: string;
  href: string;
  icon: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const context = useContext(TwitterContext);
  const currentAccount = context?.currentAccount || "";
  const currentUser = context?.currentUser || {};
  const getCurrentUserDetails = context?.getCurrentUserDetails || (() => {});

  // Fetch user details when component mounts
  useEffect(() => {
    if (currentAccount) {
      getCurrentUserDetails(currentAccount);
    }
  }, [currentAccount, getCurrentUserDetails]);

  const sidebarItems: SidebarItem[] = [
    { label: "Home", href: "/", icon: "/icons/home.svg" },
    { label: "Explore", href: "/explore", icon: "/icons/explore.svg" },
    {
      label: "Notifications",
      href: "/notifications",
      icon: "/icons/notification.svg",
    },
    { label: "Messages", href: "/messages", icon: "/icons/message.svg" },
    { label: "Bookmarks", href: "/bookmarks", icon: "/icons/bookmark.svg" },
    { label: "Lists", href: "/lists", icon: "/icons/list.svg" },
    { label: "Profile", href: "/profile", icon: "/icons/profile.svg" },
    { label: "More", href: "/more", icon: "/icons/more.svg" },
  ];

  return (
    <aside className="w-[275px] h-screen py-4 px-6 border-r border-black/[.08] dark:border-white/[.145] fixed left-0 top-0 flex flex-col bg-white/90 dark:bg-black/90 backdrop-blur-sm">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-block p-3 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
        >
          <div className="w-9 h-9 relative">
            <Image
              src="/twitter-logo.svg"
              alt="Twitter Logo"
              width={36}
              height={36}
              className="text-[#1d9bf0] dark:invert"
            />
          </div>
        </Link>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="flex items-center gap-4 p-3 px-4 rounded-full hover:bg-gray-100 dark:hover:bg-white/[.06] transition-colors duration-200 text-xl font-medium group"
              >
                <div className="w-6 h-6 relative group-hover:scale-110 transition-transform duration-200">
                  <Image
                    src={item.icon}
                    alt={`${item.label} icon`}
                    width={24}
                    height={24}
                    className="dark:invert"
                  />
                </div>
                <span className="text-black dark:text-white">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <button
        onClick={() => {
          window.location.href = `${pathname}?mint=${currentAccount}`;
        }}
        className="w-full rounded-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white py-3.5 font-bold mt-6 transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5 active:translate-y-0"
      >
        Mint
      </button>
      <button className="w-full rounded-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white py-3.5 font-bold mt-6 transition-all duration-200 shadow-sm hover:shadow transform hover:-translate-y-0.5 active:translate-y-0">
        Tweet
      </button>

      <div className="mt-auto pt-4 border-t border-black/[.08] dark:border-white/[.145] mt-6">
        <div className="flex items-center gap-3 p-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/[.06] cursor-pointer transition-colors duration-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden relative flex items-center justify-center text-white font-bold">
            {currentUser?.profileImage ? (
              <Image
                src={currentUser.profileImage}
                alt="Profile"
                width={40}
                height={40}
                className="object-cover"
              />
            ) : currentUser?.name ? (
              currentUser.name.charAt(0).toUpperCase()
            ) : (
              "U"
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold truncate">{currentUser?.name || "User"}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              @
              {currentUser?.walletAddress
                ? `${currentUser.walletAddress.slice(
                    0,
                    4
                  )}...${currentUser.walletAddress.slice(-4)}`
                : "user"}
            </p>
          </div>
          <div className="w-5 h-5 relative">
            <Image
              src="/icons/more-dots.svg"
              alt="More options"
              width={20}
              height={20}
              className="dark:invert opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
