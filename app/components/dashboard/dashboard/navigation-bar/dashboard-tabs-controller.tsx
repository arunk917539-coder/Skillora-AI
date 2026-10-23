"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs } from "@/app/components/ui/tabs";

const VALID_TABS = [
  "dashboard",
  "mock_interviews",
  "create_interview",
  "interview_history",
  "live_interviews",
  "hr_questions",
] as const;

export type DashboardTab = (typeof VALID_TABS)[number];

function isDashboardTab(value: string | null): value is DashboardTab {
  return value !== null && VALID_TABS.some((tab) => tab === value);
}

export const HrAuthContext = createContext<boolean>(false);
export const useIsHr = () => useContext(HrAuthContext);

export const DashboardTabContext = createContext<{
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}>({
  activeTab: "dashboard",
  setActiveTab: () => {},
});
export const useDashboardTab = () => useContext(DashboardTabContext);

export default function DashboardTabsController({
  children,
  isHr = false,
}: {
  children: React.ReactNode;
  isHr?: boolean;
}) {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard");

  useEffect(() => {
    setActiveTab(
      isDashboardTab(requestedTab) ? requestedTab : "dashboard"
    );
  }, [requestedTab]);

  const handleTabChange = (value: string) => {
    if (isDashboardTab(value)) {
      setActiveTab(value);
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("tab", value);
        window.history.replaceState(null, "", url.toString());
      }
    }
  };

  return (
    <HrAuthContext.Provider value={Boolean(isHr)}>
      <DashboardTabContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="max-h-screen w-full"
        >
          {children}
        </Tabs>
      </DashboardTabContext.Provider>
    </HrAuthContext.Provider>
  );
}
