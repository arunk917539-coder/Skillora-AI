import "../../../../globals.css";
import type { Metadata } from "next";
import Provider from "@/app/provider";
import Image from "next/image";
import Link from "next/link";
import { Space_Grotesk } from "next/font/google";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skillora AI | Assessment",
  description: "Complete a workplace scenario assessment and review your development feedback.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full w-full">
      <body className={`${spaceGrotesk.className} gradient min-h-screen w-full text-slate-100 selection:bg-violet-600 selection:text-white`}>
        <div className="relative min-h-screen w-full">
          <div className="pointer-events-none absolute right-1/4 top-0 h-[400px] w-[500px] -translate-y-[20%] rounded-full bg-violet-600/10 blur-[120px]" />
          <div className="pointer-events-none absolute left-1/4 top-20 h-[400px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />

          <div className="mx-auto w-full min-h-screen max-w-full px-4 sm:max-w-[540px] sm:px-6 md:max-w-[720px] md:px-8 lg:max-w-[960px] xl:max-w-[1280px]">
            <header className="flex pt-4 pb-3 sm:pt-6 sm:pb-4 lg:pt-8 items-center flex-row justify-between z-10 border-b border-white/5">
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <div className="relative h-8 w-36 sm:h-10 sm:w-44">
                  <Image
                    src="/skillora-horizontal.png"
                    alt="Skillora AI"
                    fill
                    className="object-contain object-left group-hover:brightness-110 transition-all"
                    priority
                  />
                </div>
              </Link>
              <div className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-400 font-medium px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/10 bg-slate-900/60 backdrop-blur">
                Workplace Behaviour Assessment
              </div>
            </header>
            <Provider>
              {children}
            </Provider>
          </div>
        </div>
      </body>
    </html>
  );
}
