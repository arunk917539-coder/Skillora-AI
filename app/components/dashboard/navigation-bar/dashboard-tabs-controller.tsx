"use client";

import { useEffect, useState } from "react";
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

type DashboardTab = (typeof VALID_TABS)[number];

function isDashboardTab(value: string | null): value is DashboardTab {
  return value !== null && VALID_TABS.some((tab) => tab === value);
}

export default function DashboardTabsController({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard");

  useEffect(() => {
    setActiveTab(
      isDashboardTab(requestedTab) ? requestedTab : "dashboard"
    );
  }, [requestedTab]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => {
        if (isDashboardTab(value)) {
          setActiveTab(value);
        }
      }}
      className="max-h-screen w-full"
    >
      {children}
    </Tabs>
  );
}
