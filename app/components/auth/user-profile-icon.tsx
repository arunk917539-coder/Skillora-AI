import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem } from "@radix-ui/react-menubar";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SignOutButton } from "./sign-out";
import { auth } from "@/app/(auth-pages)/auth";
import { Download, Shield } from "lucide-react";

type UserProfileTypes = {
  isOptionEnabled?: boolean;
};

const UserProfileIcon = async (prop: UserProfileTypes) => {
  let session = null;
  try {
    session = await auth();
  } catch {
    session = null;
  }

  if (!session?.user) return null;

  const userInitial = session.user.name ? session.user.name.charAt(0).toUpperCase() : "U";

  return (
    <Menubar className="border-0 bg-transparent p-0">
      <MenubarMenu>
        <MenubarTrigger className="focus:outline-none cursor-pointer">
          {session.user.image ? (
            <Image
              src={session.user.image}
              className="rounded-full object-cover ring-2 ring-violet-500/40 hover:ring-violet-500 transition-all"
              height={38}
              width={38}
              alt={session.user.name ?? "User avatar"}
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-xs font-bold text-white ring-2 ring-white/10 hover:ring-violet-500/40 transition-all shadow-md">
              {userInitial}
            </div>
          )}
        </MenubarTrigger>

        <MenubarContent className="z-50 min-w-[140px] rounded-xl border border-white/10 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-md text-slate-200">
          <div className="px-3 py-1.5 border-b border-white/5 mb-1">
            <p className="text-xs font-medium text-white truncate">{session.user.name ?? "Account"}</p>
            <p className="text-[10px] text-slate-400 truncate">{session.user.email ?? ""}</p>
          </div>
          <MenubarItem asChild className="focus:outline-none cursor-pointer">
            <a
              href="/api/user/export"
              download
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Download className="h-3 w-3 text-cyan-400" />
              <span>Export My Data</span>
            </a>
          </MenubarItem>
          <MenubarItem asChild className="focus:outline-none cursor-pointer">
            <Link
              href="/privacy"
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Shield className="h-3 w-3 text-violet-400" />
              <span>Privacy Policy</span>
            </Link>
          </MenubarItem>
          <div className="my-1 border-t border-white/5" />
          <MenubarItem className="focus:outline-none cursor-pointer">
            <SignOutButton />
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default UserProfileIcon;
