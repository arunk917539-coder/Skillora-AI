import React from "react";
import Image from "next/image";
import Link from "next/link";
import UserProfileIcon from "../../auth/user-profile-icon";
import TabBar from "./tab-bar";
import { auth } from "@/app/(auth-pages)/auth";
import { isAuthorizedHr } from "@/app/lib/workplace/hr-authorization";

const DashboardNavBar = async () => {
  let isHr = false;
  try {
    const session = await auth();
    isHr = await isAuthorizedHr(session?.user?.id, session?.user?.email);
  } catch {
    isHr = false;
  }

  return (
    <div className="hidden pt-8 pb-6 lg:flex flex-row items-center justify-between z-20 border-b border-white/5">
      <Link href="/" className="group flex items-center gap-3">
        <div className="relative h-10 w-44">
          <Image
            src="/skillora-horizontal.png"
            alt="Skillora AI"
            fill
            className="object-contain object-left group-hover:brightness-110 transition-all duration-200"
            priority
          />
        </div>
      </Link>
      <div className="flex flex-row items-center gap-4">
        <TabBar isHr={isHr} />
        <UserProfileIcon />
      </div>
    </div>
  );
};

export default DashboardNavBar;
