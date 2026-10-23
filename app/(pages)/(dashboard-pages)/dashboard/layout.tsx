import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/app/(auth-pages)/auth";
import { Space_Grotesk } from "next/font/google";
import "../../../globals.css";
import Provider from "@/app/provider";
import NavBarContainer from "@/app/components/dashboard/navigation-bar/nav-bar-wrapper";
import DashboardNavBar from "@/app/components/dashboard/navigation-bar/nav-bar";
import DashboardTabsController from "@/app/components/dashboard/navigation-bar/dashboard-tabs-controller";
import { Suspense } from "react";
import Loader from "@/app/components/ui/loader";
import { Toaster } from "@/app/components/ui/sonner";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Skillora AI | Dashboard",
  description: "Review workplace assessments, competency scores, and development progress.",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  return (
    <html lang="en" className="dark h-full w-full">
      <body className={`${spaceGrotesk.className} gradient min-h-screen w-full text-slate-100 selection:bg-violet-600 selection:text-white`}>
        <div className="relative min-h-screen w-full">
          {/* Refined enterprise subtle glow accents */}
          <div className="pointer-events-none absolute right-1/4 top-0 h-[400px] w-[500px] -translate-y-[20%] rounded-full bg-violet-600/10 blur-[120px]" />
          <div className="pointer-events-none absolute left-1/4 top-20 h-[400px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />

          <div className="mx-auto w-full max-w-full px-4 sm:max-w-[540px] sm:px-6 md:max-w-[720px] md:px-8 lg:max-w-[960px] xl:max-w-[1280px]">
            <Provider>
              <Suspense fallback={<Loader />}>
                <DashboardTabsController>
                  <NavBarContainer />
                  <DashboardNavBar />
                  {children}
                </DashboardTabsController>
              </Suspense>
            </Provider>
            <Toaster />
          </div>
        </div>
      </body>
    </html>
  );
}
