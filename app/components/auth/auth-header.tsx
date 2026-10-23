"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const data = {
  login: {
    header: "Log in to Skillora AI",
    subheader: "Welcome back! Please enter your details to continue.",
  },
  signup: {
    header: "Create your account",
    subheader: "Join Skillora AI to practise workplace scenarios and track your progress.",
  },
};

const AuthHeader = () => {
  const pathname = usePathname();
  const isSignUpSelected = pathname === "/signup";
  const key = isSignUpSelected ? "signup" : "login";
  const { header, subheader } = data[key];

  return (
    <section className="flex flex-col gap-5 items-center justify-center w-full max-w-md pb-2">
      <div className="flex items-center flex-col justify-center">
        <Link href="/" className="group flex items-center justify-center">
          <div className="relative h-12 w-52">
            <Image
              src="/skillora-horizontal.png"
              alt="Skillora AI"
              fill
              className="object-contain group-hover:brightness-110 transition-all"
              priority
            />
          </div>
        </Link>
      </div>

      <div className="text-center flex flex-col gap-1.5">
        <h1 className="font-bold text-2xl md:text-3xl tracking-tight text-white">{header}</h1>
        <p className="text-sm text-slate-400">{subheader}</p>
      </div>

      {/* Modern Segmented Control */}
      <div className="flex flex-row items-center justify-center w-full p-1 rounded-full bg-slate-900/90 border border-white/10 shadow-inner">
        <Link href="/signup" className="flex-1 text-center">
          <div
            className={`w-full py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              isSignUpSelected
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign up
          </div>
        </Link>

        <Link href="/login" className="flex-1 text-center">
          <div
            className={`w-full py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              !isSignUpSelected
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Log in
          </div>
        </Link>
      </div>
    </section>
  );
};

export default AuthHeader;
