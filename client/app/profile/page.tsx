import Sidebar from "@/components/Sidebar";
import Widgets from "@/components/widgets";
import ProfileHeader from "@/components/profileHeader";
import { useContext } from "react";
import { TwitterContext } from "@/app/context/TwitterContext";

export default function ProfilePage() {

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      <div className="flex-1 flex max-w-[1400px] mx-auto">
        <Sidebar />
        <main className="flex-[2] ml-[275px] border-x border-black/[.08] dark:border-white/[.145] min-h-screen">
          <ProfileHeader />
        </main>
        <Widgets />
      </div>
    </div>
  );
}
