import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "../../globals.css";
import NavBar from "@/app/components/home/nav-bar";
import Provider from "@/app/provider";
import { ReactLenis } from "@/app/lib/lenis";
import Footer from "../../components/home/footer";
import { CookieConsentBanner } from "@/app/components/privacy/cookie-consent-banner";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skillora AI | AI Workplace Behavioural Assessment & Skill Development",
  description: "Practise realistic workplace scenarios, explore competency signals, and develop core behavioural skills with explainable AI feedback.",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark w-full">
      <head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>

      <body className={`${spaceGrotesk.className} w-full min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-violet-600 selection:text-white`}>
        <ReactLenis root options={{ lerp: 0.8, duration: 1.5 }}>
          <Provider>
            <div className="relative min-h-screen w-full overflow-x-hidden">
              {/* Subtle ambient lighting */}
              <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-violet-600/15 via-blue-600/10 to-transparent blur-[120px]" />
              <NavBar />
              {children}
              <Footer />
              <CookieConsentBanner />
            </div>
          </Provider>
        </ReactLenis>
      </body>
    </html>
  );
}
