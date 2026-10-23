import Link from "next/link";
import Image from "next/image";
import { auth } from "../../(auth-pages)/auth";
import UserProfileIcon from "../auth/user-profile-icon";

const NavBar = async () => {
  let session = null;
  try {
    session = await auth();
  } catch {
    session = null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 w-full max-w-full items-center justify-between px-4 sm:max-w-[540px] sm:px-6 md:max-w-[720px] md:px-8 lg:max-w-[960px] xl:max-w-[1280px]">
        <div className="flex items-center">
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
        </div>

        <nav className="flex items-center gap-3 sm:gap-6">
          {!session ? (
            <>
              <Link href="/login" className="nav-btn">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-violet-500/25 transition-all duration-200 hover:brightness-110"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-200 transition-all hover:bg-violet-500/20"
              >
                Dashboard
              </Link>
              <UserProfileIcon isOptionEnabled={true} />
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
