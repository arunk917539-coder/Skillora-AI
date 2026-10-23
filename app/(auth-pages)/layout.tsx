import "../globals.css";
import { Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

export const metadata: Metadata = {
  title: "Skillora AI | Sign in",
  description: "Sign in to practise workplace scenarios and review your development feedback.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full w-full">
      <body className={`${spaceGrotesk.className} gradient min-h-screen w-full text-slate-100 selection:bg-violet-600 selection:text-white`}>
        <div className="relative min-h-screen w-full flex items-center justify-center">
          <div className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 h-[450px] w-[550px] rounded-full bg-violet-600/10 blur-[130px]" />
          {children}
        </div>
      </body>
    </html>
  );
}
