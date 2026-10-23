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
  title: "Workplace Compass | Dashboard",
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
    <html lang="en" className="h-full w-full">
      <body className="gradient h-screen w-full">
        <div className="relative h-full w-full">
          <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-x-[10%] translate-y-[20%] rounded-full bg-[#898da5] opacity-50 blur-[80px] brightness-200" />
          <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-x-[220%] translate-y-[30%] rounded-full bg-[#5a5f7a] opacity-50 blur-[80px] brightness-200" />

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
